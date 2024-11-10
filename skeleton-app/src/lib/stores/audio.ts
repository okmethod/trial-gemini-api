import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { availableAudioUrl } from "$lib/utils/convertOggToMp3.client";

const savedAudioOn = typeof localStorage !== "undefined" ? localStorage.getItem("audioOn") === "true" : false;

const audioOnStore = writable<boolean>(savedAudioOn ?? false);

export function getAudioOn(): boolean {
  return get(audioOnStore);
}

export function setAudioOn(audioOn: boolean): void {
  audioOnStore.set(audioOn);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("audioOn", audioOn.toString());
  }
}

let latestUrl: string | null = null;
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let audioSource: AudioBufferSourceNode;
export async function initAudio(oggUrl: string): Promise<() => void> {
  if (latestUrl !== oggUrl) {
    try {
      const audioUrl = await availableAudioUrl(oggUrl);
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      audioContext = new AudioContext();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      latestUrl = oggUrl;
    } catch (error) {
      console.error("Error decoding audio data:", error);
    }
  }
  prepareAudioSource();
  return playAudio;
}

function prepareAudioSource() {
  if (!audioBuffer || !audioContext) return;
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioContext.destination);
}

function playAudio() {
  if (!browser || !getAudioOn() || !audioSource) return;
  audioSource.start(0);
  prepareAudioSource();
}
