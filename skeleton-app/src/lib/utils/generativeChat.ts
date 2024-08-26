import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StartChatParams, RequestOptions, GenerateContentResult } from "@google/generative-ai";
import type { Chat } from "$lib/types/chat";
import postChatReply from "$lib/api/functions/postChatReply.client";
import { checkToken } from "$lib/utils/auth";
import { defaultModelParams } from "$lib/constants/modelSettings";

const apiKey = process.env.GEMINI_API_KEY ? (process.env.GEMINI_API_KEY as string) : null;

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

  let reply: string | null;
  if (apiKey) {
    // local
    try {
      const response = await generateChatReply(apiKey, modelName, chatParam, userInput);
      reply = response.response.text();
    } catch (error) {
      console.error("Failed to receive chat reply in local:", error);
      return null;
    }
  } else {
    // production
    try {
      const response = await postChatReply(fetchFunction, defaultModelParams(modelName), chatParam, userInput);
      reply = response.response.candidates ? (response.response.candidates[0].content.parts[0].text ?? null) : null;
    } catch (error) {
      console.error("Failed to receive chat reply in production:", error);
      return null;
    }
  }
  return reply;
}

async function generateChatReply(
  apiKey: string,
  modelName: string | null,
  chatParam: StartChatParams,
  userInput: string,
): Promise<GenerateContentResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const token = checkToken();
  const model = genAI.getGenerativeModel(defaultModelParams(modelName), token ? requestOptions(token) : undefined);
  const chat = model.startChat(chatParam);
  const response = await chat.sendMessage(userInput);
  return response;
}

const requestOptions = (token: string): RequestOptions => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};
