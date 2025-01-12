import { defineString } from "firebase-functions/params";

export function getEnv(envName: string, stringParam: ReturnType<typeof defineString>): string {
  const envValue = process.env.NODE_ENV === "production" ? stringParam.value() : process.env[envName];
  if (!envValue) {
    throw new Error(`Failed to get env: ${envName}`);
  }
  return envValue;
}
