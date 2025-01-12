import { defineString } from "firebase-functions/params";

const envs: string[] = ["GEMINI_API_KEY"] as const;

const stringParams = envs.reduce(
  (acc, env) => {
    acc[env] = defineString(env);
    return acc;
  },
  {} as Record<(typeof envs)[number], ReturnType<typeof defineString>>,
);

export function getEnv(envName: string): string {
  const envValue = process.env.NODE_ENV === "production" ? stringParams[envName].value() : process.env[envName];
  if (!envValue) {
    throw new Error(`Failed to get env: ${envName}`);
  }
  return envValue;
}
