import type { ModelParams, RequestOptions, StartChatParams, Part, GenerateContentResult } from "@google/generative-ai";

interface RequestBody {
  modelParams: ModelParams;
  requestOptions: RequestOptions | undefined;
  startChatParams: StartChatParams;
  userInput: Array<string | Part>;
}

async function postChatReply(
  fetchFunction: typeof fetch,
  modelParams: ModelParams,
  requestOptions: RequestOptions | undefined,
  startChatParams: StartChatParams,
  userInput: Array<string | Part>,
): Promise<GenerateContentResult> {
  const apiUrl = "/api/chat-reply";
  const requestBody: RequestBody = { modelParams, requestOptions, startChatParams, userInput };
  const requestInit: RequestInit = {
    method: "POST",
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetchFunction(apiUrl, requestInit);
    if (!response.ok) {
      throw new Error("Failed to receive generatedContent.");
    }
    const data = (await response.json()) as GenerateContentResult;
    return data;
  } catch (error) {
    console.error("Failed to receive generatedContent:", error);
    throw error;
  }
}

export default postChatReply;
