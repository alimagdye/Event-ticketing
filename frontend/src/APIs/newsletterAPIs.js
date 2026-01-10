import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function subscribeToNewsletter(email, language) {
  const token = getAccessToken();
  console.log(token);
  return axios.post(
    "http://localhost:3000/api/v1/newsletter/subscribe",
    { email, language },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}