import { writable } from "svelte/store";

export const idToken = writable<string | null>(null);
