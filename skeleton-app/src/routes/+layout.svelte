<script lang="ts">
  import "../app.postcss";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { Toast, Modal, initializeStores, storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import Icon from "@iconify/svelte";
  import { audioOn } from "$lib/stores/audio";
  import { generations, generationId, type GenerationId } from "$lib/stores/generation";
  import { pickRandomNumbers } from "$lib/utils/collections";
  import { loadFFmpeg } from "$lib/utils/convertOggToMp3.client";
  import { POKE_API_STADIUM_URL } from "$lib/constants/common";

  export let data: {
    generationSymbolUrlDict: Record<number, string>;
  };

  let options = [
    { value: "", label: "" },
    ...Object.entries(generations).map(([value, { label }]) => ({ value, label })),
  ];

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let currentAudioOn = false;
  let currentGenerationId: GenerationId | null = null;
  let currentGenerationImageUrl: string | null = null;
  onMount(async () => {
    currentAudioOn = get(audioOn);
    currentGenerationId = get(generationId);
    currentGenerationImageUrl = getSymbolImageUrl(currentGenerationId);
    options = options.filter((option) => option.value !== "");
    const audio = document.createElement("audio");
    const isSupportedOgg = !!audio.canPlayType('audio/ogg; codecs="vorbis"');
    await loadFFmpeg(isSupportedOgg);
  });

  function getSymbolImageUrl(generationId: GenerationId): string {
    const symbolPokeId = pickRandomNumbers(generations[generationId].symbolPokeIds, 1)[0];
    return data.generationSymbolUrlDict[symbolPokeId];
  }

  function toggleAudioOn() {
    currentAudioOn = !currentAudioOn;
    audioOn.set(currentAudioOn);
  }
</script>

<svelte:head>
  <title>Pokenater</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

<div class="flex flex-col h-screen">
  <div class="relative border-b border-gray-400 bg-gray-100">
    <div class="flex items-center justify-between h-full">
      <a
        href={POKE_API_STADIUM_URL}
        class="flex flex-row items-center space-x-1 pt-1 pb-1 pl-1 pr-2 m-1 text-sm text-gray-500 bg-white border border-gray-400 rounded-md"
      >
        <div class="w-5 h-5">
          <Icon icon="mdi:home-outline" class="text-gray-500 w-full h-full" />
        </div>
        <span class="">HOME</span>
      </a>
      <div class="w-8 h-8 bg-white border border-gray-400 rounded-full ml-1">
        <button on:click={toggleAudioOn} class="w-full h-full flex items-center justify-center">
          <Icon icon={$audioOn ? "mdi:volume-high" : "mdi:volume-off"} class="text-gray-500 w-3/4 h-3/4" />
        </button>
      </div>
      <div class="flex-grow"><!--spacer--></div>
      <div class="w-8 h-8 bg-white border border-gray-400 rounded-full">
        <img
          src={currentGenerationImageUrl}
          alt="generationSymbol"
          class="w-full h-full object-contain transform scale-150"
        />
      </div>
      <select
        id="generationId"
        bind:value={currentGenerationId}
        class="w-24 pt-1 pb-1 pl-2 pr-2 m-1 text-sm text-gray-500 border-gray-400 rounded-md"
      >
        {#each options as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="container mx-auto overflow-y-auto pb-16">
    <slot />
  </div>
</div>
