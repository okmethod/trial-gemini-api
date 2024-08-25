import { get } from "svelte/store";
import type { RequestOptions } from "@google/generative-ai";
import { idToken } from "$lib/stores/auth";

export function checkToken(): string | null {
  const token = get(idToken);
  if (!token) return null;
  // if (isTokenExpired(token)) return null; // TODO: 実装したい
  return token;
}

const clientId = process.env.OAUTH2_CLIENT_ID as string;

export const redirectUri = "urn:ietf:wg:oauth:2.0:oob";

export const authUrl = (): string => {
  const authBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/generative-language.tuning",
    "https://www.googleapis.com/auth/generative-language.retriever",
  ];
  const authUrl = `${authBaseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(" ")}&access_type=offline`;
  return authUrl;
};

export const requestOptions = (token: string): RequestOptions => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};
