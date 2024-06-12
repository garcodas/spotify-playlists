import { UserProfile } from "@/types/UserResponse";
import { getToken, isTokenExpired } from "@/services/authService";
import axios from "axios";

async function fetchUserInfo() {
  if (isTokenExpired()) {
    return null;
  }
  const token = getToken();
  return await axios.get<UserProfile>(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { fetchUserInfo };
