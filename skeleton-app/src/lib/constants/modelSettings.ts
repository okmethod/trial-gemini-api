import type { ModelParams } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { TunedModel } from "$lib/types/model";

const DEFAULT_MODEL = "gemini-1.5-flash";
export const ALLOWED_MODELS: TunedModel[] = [
  {
    name: "gemini-1.5-flash",
    displayName: "デフォルト",
    updateTime: "-",
    state: "ACTIVE",
  },
  {
    name: "tunedModels/v1-nteipb5ttyxg",
    displayName: "ポケモン学習v1",
    updateTime: "2024-08-25T00:55:51.907213Z",
    state: "ACTIVE",
  },
];

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

export const defaultModelParams = (modelName: string | null): ModelParams => ({
  model: modelName ?? DEFAULT_MODEL,
  safetySettings: TOO_LOOSE_BLOCK,
});
