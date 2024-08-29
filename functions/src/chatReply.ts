/* eslint-disable object-curly-spacing */

import type { Request, Response } from "express";
import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  ModelParams,
  RequestOptions,
  StartChatParams,
  Part,
  GenerateContentResult,
} from "@google/generative-ai";

interface RequestBody {
  modelParams: ModelParams;
  requestOptions: RequestOptions | undefined;
  startChatParams: StartChatParams;
  userInput: Array<string | Part>;
}

const chatReply = async (req: Request, res: Response) => {
  const geminiApiKey = functions.config().api?.geminiapikey;
  if (!geminiApiKey) {
    res.status(500).json({ error: "Gemini API Key not configured" });
    return;
  }

  let requestBody: RequestBody;
  try {
    requestBody = JSON.parse(req.body);
  } catch (error) {
    res.status(400).json({
      error: "Invalid JSON format",
      details: req.body,
    });
    return;
  }

  const {
    modelParams,
    requestOptions,
    startChatParams,
    userInput,
  } = requestBody;
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
    genAI = new GoogleGenerativeAI(geminiApiKey);
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
