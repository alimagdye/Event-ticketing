import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";

export async function getEvents({id,slug}) {


  return axios.get(`http://localhost:3000/api/v1/events/${id}`, {});
  
}

export async function checkoutEvent(tickets,id) {
  const token = getAccessToken();
  return axios.post(`http://localhost:3000/api/v1/events/${id}/checkout`, { ...tickets },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}