<script lang="ts">
  import Icon from "@iconify/svelte";
  import { fetchText } from "$lib/utils/generativeLanguage";
  import type { PokeData } from "./+page";

  export let data: {
    trainingPokeDict: Record<number, PokeData>;
  };

  async function explainImages() {
    console.log("Ready to export");

    for (const key in data.trainingPokeDict) {
      const pokeData = data.trainingPokeDict[key];
      const generatedtext = await fetchText(null, [pokeData.prompt, pokeData.imagePart]);
      console.log(`Generated content for ${pokeData.name}:`, generatedtext);
    }
  }

  let exportFileName = "tuning.csv";
  let isProcessing = false;
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle">
    <h1 class="cTitleStyle">チューニング・サポーター</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !min-w-[300px] !max-w-[600px]">
    <!-- 各種ダウンロードボタン -->
    <div class="m-4">
      <div class="flex flex-col md:flex-row space-x-3">
        <div class="cInputFormAndMessagePartStyle">
          <input type="text" id="id" bind:value={exportFileName} class="border rounded px-4 py-1 h-full" />
          <form on:submit|preventDefault={explainImages}>
            <button type="submit" disabled={isProcessing} class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}">
              <div class="cIconDivStyle">
                <Icon icon="mdi:download-box-outline" class="cIconStyle" />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
