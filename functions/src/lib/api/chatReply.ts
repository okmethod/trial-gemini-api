import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ModelParams, RequestOptions, StartChatParams, Part, GenerateContentResult } from "@google/generative-ai";

interface RequestBody {
  modelParams: ModelParams;
  requestOptions: RequestOptions | undefined;
  startChatParams: StartChatParams;
  userInput: Array<string | Part>;
}

const geminiApiKey = defineString("GEMINI_API_KEY");

const chatReply = async (req: Request, res: Response) => {
  if (!geminiApiKey) {
    res.status(500).json({ error: "Gemini API Key not configured" });
    return;
  }

  let requestBody: RequestBody;
  try {
    requestBody = JSON.parse(req.body);
  } catch (error) {
    console.warn(error);
    res.status(400).json({
      error: "Invalid JSON format",
      details: req.body,
    });
    return;
  }

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

  let genAI: GoogleGenerativeAI | null = null;
  try {
    genAI = new GoogleGenerativeAI(geminiApiKey.value());
  } catch (err) {
    console.error(err);
  }
  if (!genAI) {
    res.status(500).json({ error: "Failed to initialize GoogleGenerativeAI" });
    return;
  }

  let response: GenerateContentResult;
  try {
    const model = genAI.getGenerativeModel(modelParams, requestOptions);
    const chat = model.startChat(startChatParams);
    response = await chat.sendMessage(userInput);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No response from GoogleGenerativeAI" });
    return;
  }

  res.json(response);
};

export default chatReply;
