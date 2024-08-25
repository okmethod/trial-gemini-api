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
const clientSecret = process.env.OAUTH2_CLIENT_SECRET as string;
const tokenEndpoint = "https://oauth2.googleapis.com/token";
const redirectUri = "urn:ietf:wg:oauth:2.0:oob";

export const authUrl = (): string => {
  const authBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/generative-language.retriever",
  ];
  const authUrl = `${authBaseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(" ")}&access_type=offline`;
  return authUrl;
};

export async function fetchAuthToken(authCode: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("code", authCode);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the auth token");
  }

  const data = await response.json();
  return data.access_token;
}

export const requestOptions = (token: string): RequestOptions => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};
