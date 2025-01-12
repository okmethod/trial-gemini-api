import type { ModelParams, RequestOptions, StartChatParams, Part } from "@google/generative-ai";

export interface RequestGenTextJson {
  modelParams: ModelParams;
  userInput: string | Array<string | Part>;
  requestOptions?: RequestOptions | undefined;
}

export interface RequestReplyChatJson extends RequestGenTextJson {
  startChatParams: StartChatParams;
}

export interface ResponseGenTextJson {
  content: string | null;
}
