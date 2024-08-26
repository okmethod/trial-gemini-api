import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StartChatParams, RequestOptions, InlineDataPart, GenerateContentResult } from "@google/generative-ai";
import type { Chat } from "$lib/types/chat";
import postChatReply from "$lib/api/functions/postChatReply.client";
import { checkToken } from "$lib/utils/auth";
import { defaultModelParams } from "$lib/constants/modelSettings";

const apiKey = process.env.GEMINI_API_KEY ? (process.env.GEMINI_API_KEY as string) : null;

const generativeModel = (apiKey: string, modelName: string | null, token: string | null) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel(defaultModelParams(modelName), requestOptions(token));
  return model;
};

const requestOptions = (token: string | null): RequestOptions | undefined => {
  if (!token) {
    return undefined;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};

async function generateContent(
  apiKey: string,
  modelName: string | null,
  token: string | null,
  request: string | Array<string | InlineDataPart>,
): Promise<GenerateContentResult> {
  const model = generativeModel(apiKey, modelName, token);
  const response = await model.generateContent(request);
  return response;
}

export async function fetchText(
  // fetchFunction: typeof fetch,
  modelName: string | null,
  request: string | Array<string | InlineDataPart>,
): Promise<string | null> {
  const token = checkToken();

  let text: string | null;
  if (apiKey) {
    // local
    try {
      const response = await generateContent(apiKey, modelName, token, request);
      text = response.response.text();
    } catch (error) {
      console.error("Failed to receive text in local:", error);
      return null;
    }
  } else {
    // production
    console.warn("Unavailable to receive text in production:");
    return null;
  }
  return text;
}

async function generateChatContent(
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
      const response = await generateChatContent(apiKey, modelName, token, chatParam, userInput);
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
