import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getStatus } from "../../APIs/onboardingAPIs";
import { setTokens } from "../../services/cookieTokenService";

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const handleCallback = async () => {
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
        

        const response =await getStatus();
        
        console.log(response.data.data)
        const status =response.data.data
        
        if (status.isComplete) {
          setTimeout(() => {
   
           navigate("/");
         }, 1000);

        } else {
          setTimeout(() => {
            navigate("/onboarding/personality-info");
          }, 1000);
        }
      } catch (error) {
        console.error("Google callback error:", error);
      }
    
  };

  useEffect(() => {
  
    handleCallback();

      return () => {};
  }, []);

  return <p>Signing you in...</p>;
}

export default GoogleCallback;
