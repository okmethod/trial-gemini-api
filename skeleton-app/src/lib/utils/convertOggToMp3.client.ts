import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg;
let isActive: boolean = false;

export async function loadFFmpeg(isSupportedOgg: boolean): Promise<void> {
  if (isSupportedOgg) {
    return;
  }
  isActive = true;
  ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  ffmpeg.on("log", ({ message }) => {
    console.debug(message);
  });
  await ffmpeg.load({
    coreURL: await _fetchBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await _fetchBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  async function _fetchBlobURL(url: string, mimeType: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    const newBlob = new Blob([blob], { type: mimeType });
    return URL.createObjectURL(newBlob);
  }
}

async function convertOggToMp3(oggUrl: string): Promise<string> {
  const response = await fetch(oggUrl);
  const arrayBuffer = await response.arrayBuffer();
  await ffmpeg.writeFile("input.ogg", new Uint8Array(arrayBuffer));
  await ffmpeg.exec(["-i", "input.ogg", "output.mp3"]);
  const data = (await ffmpeg.readFile("output.mp3")) as Uint8Array;
  const mp3Url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));
  return mp3Url;
}

export const availableAudioUrl = async (oggUrl: string): Promise<string> => {
  if (!isActive) {
    return oggUrl;
  } else {
    return await convertOggToMp3(oggUrl);
  }
};
