import { createContext, use, useContext, useEffect, useState } from "react";
import { getAccessToken, refreshAccessToken } from "../services/cookieTokenService";
import { jwtDecode } from "jwt-decode";

import { refreshToken } from "../APIs/authAPIs";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  
  const updateUser = async(user) =>{

    setUser(user);
            const response = await refreshToken();

        refreshAccessToken(response.data);

  } 
  useEffect(() => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const decoded = jwtDecode(accessToken);
      setUser(decoded);
      // console.log("user:", decoded);
    } catch (error) {
      console.log("invalid token:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
      
      const interval = setInterval(async () => {
          // console.log("Token refreshing...");
          
      try {
        const response = await refreshToken();

        refreshAccessToken(response.data);
      } catch (error) {
        console.log(error);

        if (
          error.response?.data?.status === 401 ||
          error.response?.data?.status === 403
        ) {
          // console.log("Refresh token expired, logging out...");
          window.location.href = "/login";
        }
      }
    }, 14* 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, updateUser }}>{children}</AuthContext.Provider>
  );
}

export const useUser = () => useContext(AuthContext);
