export async function getUserProfile() {

  const token = getAccessToken();
  return axios.get(
    "http://localhost:3000/api/v1/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}