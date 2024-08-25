import type { ModelParams } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-1.5-flash";
const TUNED_MODELS = ["tunedModels/v1-nteipb5ttyxg"];
export const MODELS = [DEFAULT_MODEL, ...TUNED_MODELS];

const TOO_LOOSE_BLOCK = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const defaultModelParams = (model: string | null): ModelParams => ({
  model: model ?? DEFAULT_MODEL,
  safetySettings: TOO_LOOSE_BLOCK,
});
