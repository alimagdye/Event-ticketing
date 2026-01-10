import axios from "axios";
import { getAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";

export async function becomeOrganizer() {

  const token = getAccessToken();
  console.log(token);
  const decode = jwtDecode(token);
  console.log("decode: ",decode)
  return axios.patch(`http://localhost:3000/api/v1/user/upgrade-to-organizer`, {},{
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
        }
  );
}
