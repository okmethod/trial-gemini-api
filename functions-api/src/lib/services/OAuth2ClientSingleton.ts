import { OAuth2Client } from "google-auth-library";
import { getEnv } from "../utils/getEnv.js";
import { pathRedirectAuthCallback } from "../consts/paths.js";

interface ClientParams {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

class OAuth2ClientSingleton {
  private static instance: OAuth2Client | null = null;

  // Singleton pattern
  private constructor() {}

  public static getInstance(): OAuth2Client {
    if (!OAuth2ClientSingleton.instance) {
      OAuth2ClientSingleton.instance = OAuth2ClientSingleton.initializeInstance({
        clientId: getEnv("GOOGLE_CLIENT_ID"),
        clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
        redirectUri: `${process.env.NODE_ENV === "production" ? getEnv("BASE_URL") : process.env.LOCAL_BASE_URL}${pathRedirectAuthCallback}`,
      });
    }
    return OAuth2ClientSingleton.instance;
  }

  private static initializeInstance(clientParams: ClientParams): OAuth2Client {
    try {
      const newInstance = new OAuth2Client(clientParams);
      return newInstance;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to initialize TwitterApi");
    }
  }
}

export default OAuth2ClientSingleton;
