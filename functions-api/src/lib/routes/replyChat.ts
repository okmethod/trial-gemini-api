import type { Request, Response } from "express";
import type { GenerateContentResult } from "@google/generative-ai";
import type { RequestReplyChatJson, ResponseGenTextJson } from "../types/genText";
import GoogleGenerativeAISingleton from "../services/GoogleGenerativeAISingleton.js";

const replyChat = async (req: Request, res: Response) => {
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

  let generatedContent: GenerateContentResult;
  try {
    const genAI = GoogleGenerativeAISingleton.getInstance();

    const headers: Headers = new Headers();
    if (req.headers.referer) headers.append("Referer", req.headers.referer);
    const model = genAI.getGenerativeModel(modelParams, {
      customHeaders: headers,
    });

    const chat = model.startChat(startChatParams);
    generatedContent = await chat.sendMessage(userInput);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No response from GoogleGenerativeAI" });
    return;
  }

  const response: ResponseGenTextJson = {
    content: generatedContent.response.text(),
  };
  res.json(response);
};

export default replyChat;
