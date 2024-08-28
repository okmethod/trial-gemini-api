import type { InlineDataPart, GenerateContentResult } from "@google/generative-ai";
import { apiKey, generativeModel } from "$lib/genlang/init";
import { checkToken } from "$lib/utils/auth";

async function generateContentLocal(
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
      const response = await generateContentLocal(apiKey, modelName, token, request);
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
