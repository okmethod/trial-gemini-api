import type { Request, Response } from "express";
import type { RequestGenTextJson, RequestReplyChatJson, ResponseGenTextJson } from "../types/genText";
import GoogleGenerativeAISingleton from "../services/GoogleGenerativeAISingleton.js";

export const genText = async (req: Request, res: Response) => {
  const requestBody: RequestGenTextJson = req.body;
  const { modelParams, promptText } = requestBody;
  if (!modelParams || !promptText) {
    console.warn("Missing required parameters:", requestBody);
    res.status(400).json({
      error: "Missing required parameters",
      details: requestBody,
    });
    return;
  }

  let generatedText: string | null;
  try {
    const genAI = GoogleGenerativeAISingleton.getInstance();

    const headers: Headers = new Headers();
    if (req.headers.referer) headers.append("Referer", req.headers.referer);
    const model = genAI.getGenerativeModel(modelParams, {
      customHeaders: headers,
    });

    const generatedContentResult = await model.generateContent(promptText);
    generatedText = generatedContentResult.response.text();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No response from GoogleGenerativeAI" });
    return;
  }

  const response: ResponseGenTextJson = {
    content: generatedText,
  };
  res.json(response);
};

export const replyChat = async (req: Request, res: Response) => {
  const requestBody: RequestReplyChatJson = req.body;
  const { modelParams, requestOptions, startChatParams, userInput } = requestBody;
  if (
    !modelParams ||
    (requestOptions !== undefined && !("customHeaders" in requestOptions)) ||
    !startChatParams ||
    !userInput
  ) {
    res.status(400).json({
      error: "Missing required parameters",
      details: requestBody,
    });
    return;
  }

  let generatedText: string | null;
  try {
    const genAI = GoogleGenerativeAISingleton.getInstance();

    const headers: Headers = new Headers();
    if (req.headers.referer) headers.append("Referer", req.headers.referer);
    const model = genAI.getGenerativeModel(modelParams, {
      customHeaders: headers,
    });

    const chat = model.startChat(startChatParams);
    const generatedContentResult = await chat.sendMessage(userInput);
    generatedText = generatedContentResult.response.text();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No response from GoogleGenerativeAI" });
    return;
  }

  const response: ResponseGenTextJson = {
    content: generatedText,
  };
  res.json(response);
};
