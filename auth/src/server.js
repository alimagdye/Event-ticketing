import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";
import { body, validationResult } from "express-validator";
import sanitize from "sanitize-html";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

const protect = function (req, res, next) {
  const authHeader = req.headers.authorization; // get the authorization header from the request.headers object

  // if the authorization header is missing or does not start with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No authorization token provided" });
    return; // exit the function
  }

  // token e.g., Bearer dkfjd.dkfa.faff
  const token = authHeader.split(" ")[1]; // get the token from the authorization header
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return; // exit the function
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // verify the token, if it is valid, it returns the payload of the token which is the data that was encoded in the token
    req.user = payload; // add the payload to the request object
    next(); // call the next middleware or handler
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // log the error message
    if (error.name === "TokenExpiredError") {
      // if the token is expired
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      // if the token is invalid
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(401).json({ message: "Authorization failed" });
    }
  }
};

const handleInputErrors = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array() });
    return;
  }

  next();
};

// ======= GOOGLE OAUTH2 SETUP =======

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CALLBACK_URL
);

// ---------- STEP 1: Send Google Auth URL ----------
app.get("/api/v1/auth/google/url", function (req, res) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
  });
  return res.status(200).json({ url });
});

// ---------- STEP 2: Handle Google Redirect ----------
app.get("/api/v1/auth/google/callback", async function (req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ message: "Missing code" });

  try {
    // Exchange code for tokens (id_token contains user info)
    const { tokens } = await oauth2Client.getToken(code);
    const { id_token } = tokens;
    // Decode ID token payload (contains user data)
    const decoded = jwt.decode(id_token);
    if (!decoded)
      return res.status(400).json({ message: "Failed to decode user info" });

    const { email, name } = decoded;

    // Check if user exists, if not create it
    let attendee = await prisma.Attendee.findUnique({ where: { email } });
    if (!attendee) {
      attendee = await prisma.Attendee.create({
        data: {
          email,
          name,
          authProvider: "GOOGLE",
          providerId: decoded.sub,
        },
      });
    }

    // Generate your own JWT (for your app)
    const token = jwt.sign(
      { attendeeId: attendee.attendeeId, email: attendee.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(201).json({
      message: "Attendee authenticated successfully",
      token,
      attendee: {
        attendeeId: attendee.attendeeId,
        name: attendee.name,
        email: attendee.email,
        isCompleted: attendee.isCompleted,
        authProvider: attendee.authProvider,
        languagePreference: attendee.languagePreference,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Google OAuth2 authentication failed",
    });
  }
});

//Purpose: Check whether current user completed onboarding.
// Response: 200 { "isComplete": true|false, "missing": ["basic","preferences","city"] }
app.get("/api/v1/onboarding/status", protect, async function (req, res) {
  try {
    const attendeeId = req.user.attendeeId;
    const attendee = await prisma.Attendee.findUnique({
      where: { attendeeId: attendeeId },
    });
    if (!attendee)
      return res.status(404).json({ message: "Attendee not found" });
    const missing = [];
    if (!attendee.age) missing.push("basic");
    if (!attendee.categories) missing.push("preferences");
    if (!attendee.city) missing.push("city");
    return res.status(200).json({
      isComplete: attendee.isCompleted,
      missing,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
});

//Purpose: Save basic profile info (name already from Google, if missing ask again).
app.post(
  "/api/v1/onboarding/basic",
  protect,
  [
    body("attendeeAge")
      .isInt({ min: 10, max: 120 })
      .withMessage("Age must be between 10 and 120"),
    body("attendeeGender")
      .isIn(["MALE", "FEMALE"])
      .withMessage("Gender must be MALE , or FEMALE"),
  ],
  handleInputErrors,
  async function (req, res) {
    try {
      const attendeeId = req.user.attendeeId;
      const attendeeAge = Number(sanitize(req.body.attendeeAge));
      const attendeeGender = sanitize(req.body.attendeeGender);
      const updatedAttendee = await prisma.Attendee.update({
        where: { attendeeId: attendeeId },
        data: { age: attendeeAge, gender: attendeeGender },
      });
      return res.status(200).json({
        message: "Basic profile info updated successfully",
        attendee: {
          attendeeId: updatedAttendee.attendeeId,
          age: updatedAttendee.age,
          gender: updatedAttendee.gender,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Attendee not found" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  }
);

//Purpose: Save selected categories/interests.
app.post(
  "/api/v1/onboarding/preferences",
  protect,
  [
    body("preferences")
      .isArray()
      .withMessage("Preferences must be an array of strings")
      .notEmpty()
      .withMessage("Preferences array must not be empty"),
  ],
  async function (req, res) {
    try {
      const attendeeId = req.user.attendeeId;
      const preferences = req.body.preferences.map((preference) =>
        sanitize(preference.toUpperCase())
      ); // sanitize each preference

      // Fetch the existing categories the user selected
      const categories = await prisma.category.findMany({
        where: { name: { in: preferences } },
      });

      if (categories.length === 0) {
        return res.status(400).json({ message: "No valid categories found" });
      }

      // Link attendee to each selected category concurrently
      await Promise.all(
        categories.map((category) =>
          prisma.attendeeFavoriteCategory.create({
            data: { attendeeId, categoryId: category.id },
          })
        )
      );

      return res.status(200).json({
        message: "Preferences updated successfully",
        preferences,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Attendee not found" });
      }
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Preferences already set" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  }
);

//Purpose: Save city selection
app.post(
  "/api/v1/onboarding/city",
  protect,
  [
    body("city")
      .trim()
      .isLength({ min: 2 })
      .withMessage("City must be at least 2 characters")
      .escape(),
  ],
  async function (req, res) {
    try {
      const attendeeId = req.user.AttendeeId;
      const city = sanitize(req.body.city); // sanitize city input
      const updatedAttendee = await prisma.Attendee.update({
        where: { attendeeId },
        data: { city, isCompleted: true },
      });
      return res.status(200).json({
        message: "City updated successfully",
        attendee: {
          attendeeId: updatedAttendee.attendeeId,
          city: updatedAttendee.city,
          isCompleted: updatedAttendee.isCompleted,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Attendee not found" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  }
);

// ======= SERVER =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
