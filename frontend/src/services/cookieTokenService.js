import Cookies from "js-cookie";
export function setTokens(data) {
    
const accessToken = data.accessToken.token;
// console.log(data.data.accessToken.token);
const refreshToken = data.refreshToken;
const expiresIn = data.accessToken.expiresIn; 


const expires = expiresIn / 86400;

Cookies.set("accessToken", accessToken, {
  expires: expires,
  secure: true,
  sameSite: "strict",
});

Cookies.set("refreshToken", refreshToken, {
  expires: 7, 
  secure: true,
  sameSite: "strict",
});
}
export  function  getAccessToken()  {
  return  Cookies.get("accessToken");
}