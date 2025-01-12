import { defineString } from "firebase-functions/params";

const getEnvValue = (key: string, fallback: string | undefined) =>
  process.env.NODE_ENV === "production" ? key : fallback;

export function getEnv(envName: string): string {
  const envStringParam = defineString(envName);
  const envValue = getEnvValue(envStringParam.value(), process.env[envName]);
  if (!envValue) {
    throw new Error("Failed to get frontend URL");
  }
  return envValue;
}
