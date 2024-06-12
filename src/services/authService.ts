import { UserProfile } from "@/types/UserResponse";
import Cookies from "js-cookie";
import { fetchUserInfo } from "./userService";
import { spotifyClientId, spotifyRedirectUrl } from "@/config/config";

const clientId: string = spotifyClientId;
const redirectUri: string = spotifyRedirectUrl;

console.log("RedirectUri", redirectUri);

const scopes = [
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
];

const getAuthUrl = (): string => {
  const authUrl = "https://accounts.spotify.com/authorize";
  const queryParams = new URLSearchParams({
    client_id: clientId,
    response_type: "token",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
  });

  return `${authUrl}?${queryParams.toString()}`;
};

const saveToken = async (token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  Cookies.set("spotifyAccessToken", token, { expires: expirationDate });

  const userRes = await fetchUserInfo();
  if (userRes) {
    Cookies.set("spotifyUserInfo", JSON.stringify(userRes.data));
  }

  window.location.href = "/";
};

const getToken = (): string | undefined => {
  return Cookies.get("spotifyAccessToken");
};

const getUserInfo = (): UserProfile | null => {
  const info = Cookies.get("spotifyUserInfo");
  return !info ? null : JSON.parse(info);
};

const isTokenExpired = (): boolean => {
  const token = getToken();
  return !token;
};

export { getAuthUrl, getToken, isTokenExpired, saveToken, getUserInfo };
