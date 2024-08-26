interface RequestBody {
  authCode: string;
}

async function postGetToken(fetchFunction: typeof fetch, authCode: string): Promise<string> {
  const apiUrl = "/api/get-token";
  const requestBody: RequestBody = { authCode };
  const requestInit: RequestInit = {
    method: "POST",
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetchFunction(apiUrl, requestInit);
    if (!response.ok) {
      throw new Error("Failed to get accessToken.");
    }
    const data = (await response.json()) as string;
    return data;
  } catch (error) {
    console.error("Failed to get accessToken:", error);
    throw error;
  }
}

export default postGetToken;
