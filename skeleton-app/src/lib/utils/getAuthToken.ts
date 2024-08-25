import type { RequestOptions } from "@google/generative-ai";

export async function getAuthToken(): Promise<string> {
  // TODO: 後で実装する
  return "";
}

export const requestOptions = (token: string): RequestOptions => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};
