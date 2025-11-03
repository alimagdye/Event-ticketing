import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

const CLIENT_URL = process.env.CLIENT_URL; // your React app URL
const JWT_SECRET = process.env.JWT_SECRET;

// ======= GOOGLE OAUTH2 SETUP =======
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CALLBACK_URL
);

// ---------- STEP 1: Send Google Auth URL ----------
app.get("/api/v1/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
  });
  return res.status(200).json({ url });
});

// ---------- STEP 2: Handle Google Redirect ----------
app.get("/api/v1/auth/google/callback", async (req, res) => {
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
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          city: "Cairo", // default for guests or can be updated in onboarding
        },
      });
    }

    // Generate your own JWT (for your app)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "User authenticated successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Google OAuth2 authentication failed",
    });
  }
});
// ======= SERVER =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
