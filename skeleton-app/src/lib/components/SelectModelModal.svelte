<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import { ALLOWED_MODELS } from "$lib/constants/modelSettings";

  export let parent;
  export let currentModelName: string;
  export let selectModel: (selectedModel: string) => void;

  const modalStore = getModalStore();
  function handleModelChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      currentModelName = target.value;
    }
    selectModel(currentModelName);
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
            {#each ALLOWED_MODELS as model}
              <label class="block">
                <input
                  type="radio"
                  name="model"
                  value={model.name}
                  bind:group={currentModelName}
                  on:change={handleModelChange}
                  class="hidden peer"
                />
                <span
                  class="
                    flex flex-col w-full mx-auto text-center border rounded-lg
                    peer-checked:bg-blue-200"
                >
                  {model.displayName}
                </span>
              </label>
            {/each}
          </div>
        </div>
      </div>
      <button on:click={closeModal} class="absolute top-2 right-2 z-10">
        <Icon icon="mdi:close" class="w-5 h-5" />
      </button>
    </div>
  </div>
{/if}
