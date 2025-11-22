import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function getStatus() {
    console.log("complited")
    const token = getAccessToken();
    console.log("accessToken:"+token)

  return axios.get("http://localhost:3000/api/v1/onboarding/status",{
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // withCredentials: true, // 🔥 required to receive cookies!
  });
}

export async function basic({ birthDate, gender }) {
    console.log("Sending:", {
  birthDate, gender
});
    const token = getAccessToken();
    console.log("accessToken:"+token)
  return axios.patch("http://localhost:3000/api/v1/onboarding/basic",{birthDate,gender} ,{
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // withCredentials: true, // 🔥 required to receive cookies!
  });
}

export async function preferences({preferences}) {
 console.log("Sending:", {
  preferences
});
    const token = getAccessToken();
    console.log("accessToken:"+token)
  return axios.patch("http://localhost:3000/api/v1/onboarding/preferences", {preferences}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // withCredentials: true, // 🔥 required to receive cookies!
  });
}

export async function location({governorate}) {
  console.log("Sending:", {
  governorate
});
    const token = getAccessToken();
    console.log("accessToken:"+token)
  return axios.patch("http://localhost:3000/api/v1/onboarding/location",{governorate}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // withCredentials: true, // 🔥 required to receive cookies!
  });
}
