/* eslint-disable object-curly-spacing */
/* eslint-disable require-jsdoc */

import type { Request, Response } from "express";
import * as functions from "firebase-functions";

interface RequestBody {
  authCode: string;
}

const getToken = async (req: Request, res: Response) => {
  // eslint-disable-next-line max-len
  const clientId = "662755261780-1rlodo5nvjrmajmru33ejjpmtcal7b22.apps.googleusercontent.com";
  const clientSecret = functions.config().api?.oauthclientsecret;
  if (!clientSecret) {
    res.status(500).json({ error: "OAuth Client Secret not configured" });
    return;
  }

  let requestBody: RequestBody;
  try {
    requestBody = JSON.parse(req.body);
  } catch (error) {
    res.status(400).json({
      error: "Invalid JSON format",
      details: req.body,
    });
    return;
  }

  const { authCode } = requestBody;
  if ( !authCode ) {
    res.status(400).json({
      error: "Missing required parameters",
      details: requestBody,
    });
    return;
  }

  const redirectUri = "urn:ietf:wg:oauth:2.0:oob";
  const response = await postTokenEndpoint(
    clientId, clientSecret, redirectUri, authCode
  );

  res.json(response);
};

async function postTokenEndpoint(
  clientId:string,
  clientSecret: string,
  redirectUri: string,
  authCode: string,
): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("code", authCode);

  const tokenEndpoint = "https://oauth2.googleapis.com/token";
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

export default getToken;
