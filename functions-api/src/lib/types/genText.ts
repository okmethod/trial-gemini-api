import type { ModelParams } from "@google/generative-ai";

export interface RequestGenTextJson {
  modelParams: ModelParams;
  promptText: string;
}

export interface ResponseGenTextJson {
  content: string | null;
}
