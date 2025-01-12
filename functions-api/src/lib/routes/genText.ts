import type { Request, Response } from "express";
import type { GenerateContentResult } from "@google/generative-ai";
import type { RequestGenTextJson, ResponseGenTextJson } from "../types/genText";
import GoogleGenerativeAISingleton from "../services/GoogleGenerativeAISingleton.js";

const genText = async (req: Request, res: Response) => {
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

  let generatedContent: GenerateContentResult;
  try {
    const genAI = GoogleGenerativeAISingleton.getInstance();
    const model = genAI.getGenerativeModel(modelParams);
    generatedContent = await model.generateContent(promptText);
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

export default genText;
