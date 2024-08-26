import { get } from "svelte/store";
import type { RequestOptions } from "@google/generative-ai";
import { accessToken } from "$lib/stores/auth";
import postGetToken from "$lib/api/functions/postGetToken.client";
import postTokenEndpoint from "$lib/api/postTokenEndpoint.client";
import { OAUTH2_CLIENT_ID as clientId, REDIRECT_URI as redirectUri } from "$lib/constants/common";

const clientSecret = process.env.OAUTH2_CLIENT_SECRET ? (process.env.OAUTH2_CLIENT_SECRET as string) : null;

export function checkToken(): string | null {
  const token = get(accessToken);
  if (!token) return null;
  // if (isTokenExpired(token)) return null; // TODO: 実装したい
  return token;
}

export const authUrl = (): string => {
  const scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/generative-language.tuning",
    "https://www.googleapis.com/auth/generative-language.retriever",
  ];

  const params = new URLSearchParams();
  params.append("response_type", "code");
  params.append("client_id", clientId);
  params.append("redirect_uri", redirectUri);
  params.append("scope", scopes.join(" "));
  params.append("access_type", "offline");

  const authBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const authUrl = `${authBaseUrl}?${params.toString()}`;
  return authUrl;
};

export const authToken = async (fetchFunction: typeof fetch, authCode: string): Promise<string | null> => {
  let token: string;
  if (clientSecret) {
    // local
    try {
      token = await postTokenEndpoint(fetchFunction, clientId, clientSecret, redirectUri, authCode);
    } catch (error) {
      console.error("Failed to get authToken in local:", error);
      return null;
    }
  } else {
    // production
    try {
      token = await postGetToken(fetchFunction, authCode);
    } catch (error) {
      console.error("Failed to get authToken in production:", error);
      return null;
    }
  }
  return token;
};

export const requestOptions = (token: string): RequestOptions => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};
