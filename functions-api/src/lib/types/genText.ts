import type { ModelParams, RequestOptions, StartChatParams, Part } from "@google/generative-ai";

export interface RequestGenTextJson {
  modelParams: ModelParams;
  promptText: string;
}

export interface RequestReplyChatJson {
  modelParams: ModelParams;
  requestOptions: RequestOptions | undefined;
  startChatParams: StartChatParams;
  userInput: Array<string | Part>;
}

export interface ResponseGenTextJson {
  content: string | null;
}
