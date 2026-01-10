import axios from "axios";
import { getAccessToken, getRefreshToken } from "../services/cookieTokenService";

export async function getStatsOrgainzerDashboard() {

  const token = getAccessToken();
  console.log(token)
  return axios.get("http://localhost:3000/api/v1/organizer/dashboard/stats",  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  );
}
export async function getAnalyticsOrgainzerDashboard() {

  const token = getAccessToken();
  console.log(token)
  return axios.get("http://localhost:3000/api/v1/organizer/dashboard/analytics",  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );
}