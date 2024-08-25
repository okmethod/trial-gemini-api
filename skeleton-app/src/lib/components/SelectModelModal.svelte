<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import getTunedModels from "$lib/api/getTunedModels.client";
  import { DEFAULT_MODEL } from "$lib/constants/modelSettings";
  import { onMount } from "svelte";

  export let parent;
  export let currentModel: string;
  export let selectModel: (selectedModel: string) => void;

  const modalStore = getModalStore();

  let models: string[] = [DEFAULT_MODEL];
  let isLoading = true;
  onMount(async () => {
    try {
      const tunedModels = await getTunedModels();
      // TODO: 表示名やらステータスのフィルタリングやら調整する
      models = [...models, ...tunedModels.map((model) => model.name)];
    } catch (error) {
      console.error("Failed to load models:", error);
    } finally {
      isLoading = false;
    }
  });

  function handleModelChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      currentModel = target.value;
    }
    selectModel(currentModel);
  }

  function closeModal() {
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div class="" data-parent={parent}>
    <div class="relative min-w-80">
      <div class="h-full h-full bg-white rounded-lg">
        <div class="p-4 flex flex-col h-full">
          <h2 class="text-xl font-bold mb-2">モデル選択</h2>
          <div class="mt-4 space-y-2">
            {#if isLoading}
              <span>Loading models...</span>
            {:else}
              {#each models as model, index}
                <label class="block">
                  <input
                    type="radio"
                    name="model"
                    value={model}
                    bind:group={currentModel}
                    on:change={handleModelChange}
                    class="hidden peer"
                  />
                  <span
                    class="
                    flex flex-col w-full mx-auto text-center border rounded-lg
                    peer-checked:bg-blue-200"
                  >
                    {model}{index === 0 ? " (default)" : ""}
                  </span>
                </label>
              {/each}
            {/if}
          </div>
        </div>
      </div>
      <button on:click={closeModal} class="absolute top-2 right-2 z-10">
        <Icon icon="mdi:close" class="w-5 h-5" />
      </button>
    </div>
  </div>
{/if}
