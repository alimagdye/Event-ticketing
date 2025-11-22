import { authController } from "../controllers/authController.js";
import { googleAuthController } from "../controllers/authController.js";
import authValidations from "../validations/authValidation.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import {
  authLimiter,
  emailLimiter,
  refreshLimiter,
  requestResetLimiter,
} from "../middlewares/rateLimiter.js";
import express from "express";

const Router = express.Router();

Router.post(
  "/register",
  authLimiter,
  authValidations.register,
  validate,
  authController.register
);

Router.post(
  "/verify-otp",
  authLimiter,
  auth,
  authValidations.verifyOtp,
  validate,
  authController.verifyOtp
);

Router.post("/resend-otp", emailLimiter, auth, authController.resendOtp);

Router.post(
  "/login",
  authLimiter,
  authValidations.login,
  validate,
  authController.login
);

Router.post(
  "/refresh-token",
  refreshLimiter,
  authValidations.refreshToken,
  validate,
  authController.refreshToken
);

Router.post(
  "/forgot-password",
  requestResetLimiter,
  authValidations.forgetPassword,
  validate,
  authController.requestResetPassword
);

Router.post(
  "/reset-password",
  requestResetLimiter,
  authValidations.resetPassword,
  validate,
  authController.resetPassword
);

Router.post(
  "/logout",
  auth,
  authValidations.logout,
  validate,
  authController.logout
);

Router.get("/google/url", authLimiter, googleAuthController.getAuthUrl);

Router.get("/google/callback", googleAuthController.handleCallback);

export default Router;
