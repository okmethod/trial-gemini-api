async function postTokenEndpoint(
  fetchFunction: typeof fetch,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authCode: string,
): Promise<string> {
  const apiUrl = "https://oauth2.googleapis.com/token";
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("code", authCode);
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  };
  try {
    const response = await fetchFunction(apiUrl, requestInit);
    if (!response.ok) {
      throw new Error("Failed to get accessToken.");
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to get accessToken:", error);
    throw error;
  }
}

export default postTokenEndpoint;
