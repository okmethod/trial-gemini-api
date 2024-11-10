import { writable, get } from "svelte/store";

const accessTokenStore = writable<string | null>(null);

export function getAccessToken(): string | null {
  return get(accessTokenStore);
}

export function setAccessToken(token: string): void {
  accessTokenStore.set(token);
}
