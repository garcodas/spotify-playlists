import { LoadingSpinner } from "@/components/app/spinner";
import { saveToken } from "@/services/authService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (accessToken && expiresIn) {
      saveToken(accessToken, parseInt(expiresIn, 10));
      navigate("/");
    }
  }, [navigate]);

  return <LoadingSpinner />;
}

export default Callback;
