import type { StartChatParams, GenerateContentResult } from "@google/generative-ai";
import type { Chat } from "$lib/types/chat";
import postChatReply from "$lib/api/functions/postChatReply.client";
import { apiKey, generativeModel, requestOptions } from "$lib/genlang/init";
import { checkToken } from "$lib/utils/auth";
import { defaultModelParams } from "$lib/constants/modelSettings";

async function generateChatContentLocal(
  apiKey: string,
  modelName: string | null,
  token: string | null,
  chatParam: StartChatParams,
  userInput: string,
): Promise<GenerateContentResult> {
  const model = generativeModel(apiKey, modelName, token);
  const chat = model.startChat(chatParam);
  const response = await chat.sendMessage(userInput);
  return response;
}

export async function fetchChatReply(
  fetchFunction: typeof fetch,
  modelName: string | null,
  chatHistory: Chat[],
  userInput: string,
): Promise<string | null> {
  const chatParam: StartChatParams = {
    history: chatHistory.map((chat) => ({
      role: chat.role,
      parts: [{ text: chat.parts }],
    })),
  };

  const token = checkToken();

  let reply: string | null;
  if (apiKey) {
    // local
    try {
      const response = await generateChatContentLocal(apiKey, modelName, token, chatParam, userInput);
      reply = response.response.text();
    } catch (error) {
      console.error("Failed to receive chat reply in local:", error);
      return null;
    }
  } else {
    // production
    try {
      const response = await postChatReply(
        fetchFunction,
        defaultModelParams(modelName),
        requestOptions(token),
        chatParam,
        userInput,
      );
      reply = response.response.candidates ? (response.response.candidates[0].content.parts[0].text ?? null) : null;
    } catch (error) {
      console.error("Failed to receive chat reply in production:", error);
      return null;
    }
  }
  return reply;
}
