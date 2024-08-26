async function postTokenEndpoint(
  fetchFunction: typeof fetch,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authCode: string,
): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("code", authCode);

  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const response = await fetchFunction(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the auth token");
  }

  const data = await response.json();
  return data.access_token;
}

export default postTokenEndpoint;
