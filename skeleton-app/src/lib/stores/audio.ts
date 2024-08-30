import { writable, get } from "svelte/store";
import { browser } from "$app/environment";

const savedAudioOn = typeof localStorage !== "undefined" ? localStorage.getItem("audioOn") === "true" : false;

export const audioOn = writable<boolean>(savedAudioOn ?? false);

audioOn.subscribe((value: boolean) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("audioOn", value.toString());
  }
});

export function playAudio(audioUrl: string | null): void {
  if (browser && get(audioOn) && audioUrl !== null) {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.warn("Audio playback failed:", error);
    });
  }
}
