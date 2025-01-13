import type { Request, Response } from "express";
import OAuth2ClientSingleton from "../services/OAuth2ClientSingleton.js";

export const redirectAuthUrl = async (req: Request, res: Response) => {
  try {
    const scopes: string[] = []; // 必要に応じて追加
    const oAuth2Client = OAuth2ClientSingleton.getInstance();
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: req.headers.referer ? encodeURIComponent(req.headers.referer) : undefined,
    });
    res.status(200).json({ redirectAuthUrl: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate OAuth2 URL" });
    return;
  }
};

export const fetchAccessToken = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const refererUrl = req.query.state as string;
  if (!code || !refererUrl) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }

  try {
    const oAuth2Client = OAuth2ClientSingleton.getInstance();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.redirect(`${refererUrl}/?access_token=${tokens.access_token}`);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch access token" });
    return;
  }
};
