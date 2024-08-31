import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { availableAudioUrl } from "$lib/utils/convertOggToMp3.client";

const savedAudioOn = typeof localStorage !== "undefined" ? localStorage.getItem("audioOn") === "true" : false;

export const audioOn = writable<boolean>(savedAudioOn ?? false);

audioOn.subscribe((value: boolean) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("audioOn", value.toString());
  }
});

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

async function loadAudio(oggUrl: string): Promise<void> {
  const audioUrl = await availableAudioUrl(oggUrl);
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();

  audioContext = new AudioContext();
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Error decoding audio data:", error);
  }
}

export async function playAudio(oggUrl: string | null) {
  if (!browser || !get(audioOn) || !oggUrl) return;
  await loadAudio(oggUrl);
  if (audioBuffer && audioContext) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
}
