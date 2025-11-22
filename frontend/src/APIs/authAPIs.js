import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function login(formData) {
  console.log(formData);

  return axios.post("http://localhost:3000/api/v1/auth/login", formData);
}

export async function signup(formData) {
  console.log(formData);
  return axios.post("http://localhost:3000/api/v1/auth/register", formData);
}
export async function verify(otp) {
  console.log(otp, typeof otp, otp.length);

  const token = getAccessToken();
  console.log(token);
  return axios.post(
    "http://localhost:3000/api/v1/auth/verify-otp",
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function resendOtps() {
  const token = getAccessToken();
  console.log(token);
  return axios.post(
    "http://localhost:3000/api/v1/auth/resend-otp",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
export async function refreashToken() {
  return axios.post("http://localhost:3000/api/v1/auth/refresh-token", {});
}
export async function frogetPassword(email) {
  return axios.post("http://localhost:3000/api/v1/auth/forgot-password", email);
}
export async function resetPassword(newPassword) {
  return axios.post(
    "http://localhost:3000/api/v1/auth//reset-password",
    newPassword
  );
}
export async function logout() {
  return axios.post("http://localhost:3000/api/v1/auth/logout", {});
}
export async function getGoogleAuth() {
  return axios.get("http://localhost:3000/api/v1/auth/google/url", {});
}
export async function googleAuthCallback() {
  return axios.get("http://localhost:3000/api/v1/auth/google/callback", {});
}
