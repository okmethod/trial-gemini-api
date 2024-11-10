<script lang="ts">
  import "../app.postcss";
  import { onMount } from "svelte";
  import { Toast, Modal, initializeStores, storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { setTheme } from "$lib/stores/theme";
  import { getAudioOn, setAudioOn } from "$lib/stores/audio";
  import { generations, getGenerationId, type GenerationId } from "$lib/stores/generation";
  import { pickRandomNumbers } from "$lib/utils/collections";
  import { loadFFmpeg } from "$lib/utils/convertOggToMp3.client";
  import { POKE_API_STADIUM_URL } from "$lib/constants/common";
  import IconButton from "$lib/components/IconButton.svelte";

  export let data: {
    generationSymbolUrlDict: Record<number, string>;
  };

  let options = [
    { value: "", label: "" },
    ...Object.entries(generations).map(([value, { label }]) => ({ value, label })),
  ];

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let isLoaded = false;
  let currentAudioOn = false;
  let currentGenerationId: GenerationId | null = null;
  let currentGenerationImageUrl: string | null = null;
  onMount(async () => {
    currentAudioOn = getAudioOn();
    currentGenerationId = getGenerationId();
    currentGenerationImageUrl = getSymbolImageUrl(currentGenerationId);
    options = options.filter((option) => option.value !== "");
    const audio = document.createElement("audio");
    const isSupportedOgg = !!audio.canPlayType('audio/ogg; codecs="vorbis"');

    function wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await Promise.all([setTheme({ name: "hamlindigo", dark: true }), loadFFmpeg(isSupportedOgg), wait(500)]);
    isLoaded = true;
  });

  function getSymbolImageUrl(generationId: GenerationId): string {
    const symbolPokeId = pickRandomNumbers(generations[generationId].symbolPokeIds, 1)[0];
    return data.generationSymbolUrlDict[symbolPokeId];
  }

  function toggleAudioOn() {
    currentAudioOn = !currentAudioOn;
    setAudioOn(currentAudioOn);
  }

  const cHeaderButtonStyle = "variant-filled border border-primary-600";
</script>

<svelte:head>
  <title>Pokenater</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

{#if isLoaded}
  <div class="h-screen flex flex-col">
    <div class="relative border-b border-gray-400 bg-primary-300 p-1">
      <div class="h-full flex items-center justify-between space-x-2">
        <IconButton
          icon="mdi:home-outline"
          label="Home"
          cButton="{cHeaderButtonStyle} !space-x-0 !py-1 !px-2"
          onClick={() => {
            window.location.href = POKE_API_STADIUM_URL;
          }}
        />
        <IconButton
          icon={currentAudioOn ? "mdi:volume-high" : "mdi:volume-off"}
          cButton="btn-icon btn-icon-sm {cHeaderButtonStyle}"
          onClick={toggleAudioOn}
        />
        <div class="flex-grow"><!--spacer--></div>
        <div class="w-9 h-9 {cHeaderButtonStyle} rounded-full">
          <img
            src={currentGenerationImageUrl}
            alt="generationSymbol"
            class="w-full h-full object-contain transform scale-150"
          />
        </div>
        <select
          id="generationId"
          bind:value={currentGenerationId}
          class="w-24 h-8 {cHeaderButtonStyle} text-sm rounded-sm py-1 px-2 m-1"
        >
          {#each options as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="w-screen mx-auto overflow-y-scroll scrollbar-gutter-stable sm:ml-2 pb-24 sm:pb-10">
      <slot />
    </div>
  </div>
{:else}
  <div class="h-screen flex items-center justify-center bg-gray-200 space-x-2">
    <div class="font-mono text-black text-2xl">Now Loading...</div>
    <!-- <img src={data.footerSymbolUrl} alt="footerSymbol" /> -->
  </div>
{/if}
