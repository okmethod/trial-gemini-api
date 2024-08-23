<script lang="ts">
  import "../app.postcss";
  import { Toast, Modal, initializeStores } from "@skeletonlabs/skeleton";
  initializeStores();

  // Floating UI for Popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <title>Pokenater</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

<div class="flex flex-col h-screen">
  <div class="border-b border-gray-400 bg-gray-100">
    <div class="flex items-center justify-between h-full">
      <a
        href="/"
        class="flex flex-row items-center space-x-1 pt-1 pb-1 pl-1 pr-2 m-1 text-sm text-gray-500 bg-white border border-gray-400 rounded-md"
        on:click|preventDefault={() => goto("/")}
      >
        <div class="w-5 h-5">
          <Icon icon="mdi:home-outline" class="text-gray-500 w-full h-full" />
        </div>
        <span class="">HOME</span>
      </a>
    </div>
  </div>

  <div class="container mx-auto overflow-y-auto pb-16">
    <slot />
  </div>
</div>
