interface RequestBody {
  authCode: string;
}

async function postApiGetToken(fetchFunction: typeof fetch, authCode: string): Promise<string> {
  const requestInit: RequestInit = {};
  const requestBody: RequestBody = { authCode };
  const requestConfig = {
    ...requestInit,
    method: "POST",
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetchFunction("/api/get-token", requestConfig);
    const data = (await response.json()) as string;
    return data;
  } catch (error) {
    console.error("Failed to fetch GoogleGenerativeAI:", error);
    throw error;
  }
}

export default postApiGetToken;
