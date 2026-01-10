import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function categories() {
  return axios.get("http://localhost:3000/api/v1/home/categories", {});
}
export async function latestEvents() {
  return axios.get("http://localhost:3000/api/v1/home/latest-events", {});
}
export async function newEventsThisWeek() {
  return axios.get("http://localhost:3000/api/v1/home/new-events-this-week", {});
}
export async function pastEvents() {
  return axios.get("http://localhost:3000/api/v1/home/past-events", {});
}
export async function nearbyEvents() {
  const token = getAccessToken();

  return axios.get("http://localhost:3000/api/v1/home/nearby-events",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export async function personalizedEvents() {

  const token = getAccessToken();

  return axios.get("http://localhost:3000/api/v1/home/personalized-events", 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
