<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { Chat } from "$lib/types/chat";

  export let parent;
  export let title: string;
  export let chatHistory: Chat[] = [];

  const modalStore = getModalStore();

  function closeModal() {
    modalStore.close();
  }

  const cMessage = "border p-1";
  const cUserMessage = `${cMessage} text-right`;
  const cAiMessage = `${cMessage} text-left`;
</script>

{#if $modalStore[0]}
  <div class="" data-parent={parent}>
    <div class="relative min-w-80">
      <div class="h-full h-full bg-white">
        <div class="p-4 flex flex-col h-full">
          <h2 class="text-xl font-bold mb-2">{title}</h2>
          <div class="overflow-y-auto flex-grow">
            <div class="text-sm text-gray-500 space-y-1">
              {#if chatHistory.length > 0}
                {#each chatHistory.slice(1) as chat}
                  <div class={chat.role === "user" ? cUserMessage : cAiMessage}>
                    <strong>{chat.role === "user" ? "You" : "AI"}:</strong>
                    <span>{chat.parts.replace(/\*/g, "")}</span>
                  </div>
                {/each}
              {:else}
                <span>なし</span>
              {/if}
            </div>
          </div>
        </div>
      </div>
      <button on:click={closeModal} class="absolute top-1 right-6 z-10">
        <Icon icon="mdi:close" class="w-5 h-5" />
      </button>
    </div>
  </div>
{/if}
