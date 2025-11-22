import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getStatus } from "../APIs/onboardingAPIs";
import { setTokens } from "../services/cookieTokenService";

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    const sendCodeToBackend = async () => {
      try {
        console.log("in callback");
        const res = await axios.get(
          `http://localhost:3000/api/v1/auth//google/callback?code=${code}`
        );

        const response = res.data;

        // Save tokens in localStorage
        setTokens(response);

        const status = (await getStatus()).data.data;

        if (status.isComplete) {
          navigate("/");
        } else {
          navigate("/onboarding/personality-info");
        }
      } catch (error) {
        console.error("Google callback error:", error);
      }
    };

    if (code) sendCodeToBackend();
  }, [code]);

  return <p>Signing you in...</p>;
}

export default GoogleCallback;
