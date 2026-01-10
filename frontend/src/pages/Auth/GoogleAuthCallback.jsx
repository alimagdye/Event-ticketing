import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getStatus } from "../../APIs/onboardingAPIs";
import { setTokens } from "../../services/cookieTokenService";

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
  
      try {
        console.log("in callback");

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const expiresIn = params.get("expiresIn");
        const refreshToken = params.get("refreshToken");
        console.log("params ",params ,"token ", token)
        const data={
          accessToken: { token, expiresIn },
          refreshToken
        }

   

        // Save tokens in localStorage
        setTokens(data);

  

        // if (status.isComplete) {
         setTimeout(() => {
  navigate("/");
}, 1000);

        // } else {
        //   navigate("/onboarding/personality-info");
        // }
      } catch (error) {
        console.error("Google callback error:", error);
      }
    

      return () => {};
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleCallback;
