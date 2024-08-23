import type { GenerativeModel } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import modelParams from "./modelParams";

export async function load(): Promise<{ model: GenerativeModel | null }> {
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string) : null;
  const model = genAI?.getGenerativeModel(modelParams) ?? null;
  return { model };
}
