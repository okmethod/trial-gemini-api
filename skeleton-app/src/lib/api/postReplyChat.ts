import { constructRequestInit, fetchApi } from "$lib/utils/request";
import type { Part } from "@google/generative-ai";
import type { Chat } from "$lib/types/chat";
import { pathReplyChat } from "$lib/constants/paths";
import type { RequestReplyChatJson, ResponseGenTextJson } from "$lib/types/genText";
import { defaultModelParams } from "$lib/constants/modelSettings";

async function postReplyChat(
  fetchFunction: typeof fetch,
  userInput: string | Array<string | Part>,
  chatHistory: Chat[],
  modelName?: string | null,
): Promise<ResponseGenTextJson> {
  const url = pathReplyChat;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const requestInit = constructRequestInit(headers);
  const requestBody: RequestReplyChatJson = {
    modelParams: defaultModelParams(modelName ?? null),
    startChatParams: {
      history: chatHistory.map((chat) => ({
        role: chat.role,
        parts: chat.parts.map((part) => (typeof part === "string" ? { text: part } : part)) as Part[],
      })),
    },
    userInput,
  };
  const requestConfig = {
    ...requestInit,
    method: "POST",
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetchApi(fetchFunction, url, requestConfig);
    return (await response.json()) as ResponseGenTextJson;
  } catch {
    return { content: null };
  }
}

export default postReplyChat;
