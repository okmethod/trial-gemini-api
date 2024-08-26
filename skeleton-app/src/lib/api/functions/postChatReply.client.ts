import type { ModelParams, StartChatParams, GenerateContentResult } from "@google/generative-ai";

interface RequestBody {
  modelParams: ModelParams;
  startChatParams: StartChatParams;
  userInput: string;
}

async function postChatReply(
  fetchFunction: typeof fetch,
  modelParams: ModelParams,
  startChatParams: StartChatParams,
  userInput: string,
): Promise<GenerateContentResult> {
  const requestInit: RequestInit = {};
  const requestBody: RequestBody = { modelParams, startChatParams, userInput };
  const requestConfig = {
    ...requestInit,
    method: "POST",
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetchFunction("/api/chat-reply", requestConfig);
    const data = (await response.json()) as GenerateContentResult;
    return data;
  } catch (error) {
    console.error("Failed to fetch GoogleGenerativeAI:", error);
    throw error;
  }
}

export default postChatReply;
