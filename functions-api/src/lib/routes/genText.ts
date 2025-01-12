import type { Request, Response } from "express";
import type { GenerativeModel, GenerateContentResult } from "@google/generative-ai";
import type { RequestGenTextJson, RequestReplyChatJson, ResponseGenTextJson } from "../types/genText";
import GoogleGenerativeAISingleton from "../services/GoogleGenerativeAISingleton.js";

const generateContent = async (
  req: Request,
  res: Response,
  generateFn: (model: GenerativeModel) => Promise<GenerateContentResult>,
): Promise<void> => {
  const requestBody: RequestGenTextJson | RequestReplyChatJson = req.body;
  const { modelParams, userInput, requestOptions } = requestBody;
  if (!modelParams || !userInput || (requestOptions !== undefined && !("customHeaders" in requestOptions))) {
    console.warn("Missing required parameters:", requestBody);
    res.status(400).json({
      error: "Missing required parameters",
      details: requestBody,
    });
    return;
  }

  try {
    const genAI = GoogleGenerativeAISingleton.getInstance();
    const additionalHeaders = req.headers.referer ? { Referer: req.headers.referer } : undefined;
    const model = genAI.getGenerativeModel(modelParams, {
      ...requestOptions,
      customHeaders: {
        ...requestOptions?.customHeaders,
        ...additionalHeaders,
      },
    });

    const generatedContentResult = await generateFn(model);
    const response: ResponseGenTextJson = {
      content: generatedContentResult.response.text(),
    };
    res.json(response);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate content" });
    return;
  }
};

export const genText = async (req: Request, res: Response) => {
  const requestBody: RequestGenTextJson = req.body;
  const { userInput } = requestBody;

  await generateContent(req, res, async (model) => {
    return await model.generateContent(userInput);
  });
};

export const replyChat = async (req: Request, res: Response) => {
  const requestBody: RequestReplyChatJson = req.body;
  const { userInput, startChatParams } = requestBody;
  if (!startChatParams) {
    console.warn("Missing required parameters:", requestBody);
    res.status(400).json({
      error: "Missing required parameters",
      details: requestBody,
    });
    return;
  }

  await generateContent(req, res, async (model) => {
    const chat = model.startChat(startChatParams);
    return await chat.sendMessage(userInput);
  });
};
