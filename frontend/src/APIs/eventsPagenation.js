import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function latestEvents(page) {
  return axios.get(`http://localhost:3000/api/v1/home/latest-events?page=${page}&limit=12`, {});
}
export async function newEventsThisWeek(page) {
  return axios.get(`http://localhost:3000/api/v1/home/new-events-this-week?page=${page}&limit=12`, {});
}
export async function pastEvents(page) {
  return axios.get(`http://localhost:3000/api/v1/home/past-events?page=${page}&limit=12`, {});
}
export async function nearbyEvents(page) {
  const token = getAccessToken();
  return axios.get(`http://localhost:3000/api/v1/home/nearby-events?page=${page}&limit=12`, {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export async function personalizedEvents(page) {

  const token = getAccessToken();

  return axios.get(`http://localhost:3000/api/v1/home/personalized-events?page=${page}&limit=12`, { },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}