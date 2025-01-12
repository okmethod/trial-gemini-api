import { constructRequestInit, fetchApi } from "$lib/utils/request";
import type { Part } from "@google/generative-ai";
import { pathGenText } from "$lib/constants/paths";
import type { RequestGenTextJson, ResponseGenTextJson } from "$lib/types/genText";
import { defaultModelParams } from "$lib/constants/modelSettings";

async function postGenText(
  fetchFunction: typeof window.fetch,
  userInput: string | Array<string | Part>,
  modelName?: string | null,
): Promise<ResponseGenTextJson> {
  const url = pathGenText;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const requestInit = constructRequestInit(headers);
  const requestBody: RequestGenTextJson = {
    modelParams: defaultModelParams(modelName ?? null),
    userInput,
  };
  const requestConfig = {
    ...requestInit,
    method: "POST",
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetchApi(fetchFunction, url, requestConfig);
    return (await response.json()) as ResponseGenTextJson;
  } catch {
    return { content: null };
  }
}

export default postGenText;
