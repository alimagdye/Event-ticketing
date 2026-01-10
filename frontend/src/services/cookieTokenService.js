import Cookies from "js-cookie";

export function setTokens(data) {
  const accessToken = data.accessToken.token;
  const expiresIn = data.accessToken.expiresIn;
  const refreshToken = data.refreshToken;
  

  const expires = expiresIn / 86400; // convert seconds → days

  Cookies.set("accessToken", accessToken, {
    expires,
    secure: true,
    sameSite: "strict",
  });

  Cookies.set("refreshToken", refreshToken, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
}
export const refreshAccessToken = async (data) => {

  const accessToken = data.data.accessToken;
  const expiresIn = data.data.expiresIn;

  Cookies.remove("accessToken");

  Cookies.set("accessToken", accessToken, {
    expires: expiresIn / 86400, 
    secure: true,
    sameSite: "strict",
  });

}

export function getAccessToken() {
  return Cookies.get("accessToken");
}

export function getRefreshToken() {
  return Cookies.get("refreshToken");
}

export function removeTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}
