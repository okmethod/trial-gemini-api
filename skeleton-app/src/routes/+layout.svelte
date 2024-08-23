<script lang="ts">
  import "../app.postcss";
  import { AppBar } from "@skeletonlabs/skeleton";
  import { Toast, Modal, initializeStores } from "@skeletonlabs/skeleton";
  initializeStores();

  // Floating UI for Popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <title>Pokenater</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

<div class="flex flex-col h-screen">
  <div class="border-b border-gray-400">
    <AppBar class="!p-1 md:!p-2">
      <div class="flex items-center h-full">
        <a href="/" class="flex items-center" on:click|preventDefault={() => goto("/")}>
          <div class="text-sm md:text-lg">TOP</div>
        </a>
      </div>
    </AppBar>
  </div>

  <div class="container mx-auto overflow-y-auto pb-16">
    <slot />
  </div>
</div>
