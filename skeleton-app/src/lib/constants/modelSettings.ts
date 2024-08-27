import type { ModelParams } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { TunedModel } from "$lib/types/model";

const DEFAULT_MODEL: TunedModel = {
  name: "gemini-1.5-flash",
  displayName: "デフォルト",
  updateTime: "-",
  state: "ACTIVE",
};

const TUNED_MODELS: TunedModel[] = [
  {
    name: "tunedModels/v1-nteipb5ttyxg",
    displayName: "ポケモン学習v1",
    updateTime: "2024-08-25T00:55:51.907213Z",
    state: "ACTIVE",
  },
  {
    name: "tunedModels/v11-7jwr4cv5rdj5",
    displayName: "ポケモン学習v1.1",
    updateTime: "2024-08-27T19:00:30.408418Z",
    state: "ACTIVE",
  },
];

export const ALLOWED_MODELS = [DEFAULT_MODEL, ...TUNED_MODELS.filter((model) => model.state === "ACTIVE")];

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
  model: modelName ?? DEFAULT_MODEL.name,
  safetySettings: TOO_LOOSE_BLOCK,
});
