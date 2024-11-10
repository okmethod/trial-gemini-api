<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { Part } from "@google/generative-ai";
  import { initAudio } from "$lib/stores/audio";
  import type { Chat } from "$lib/types/chat";
  import { fetchChatReply } from "$lib/genlang/generateChatContent";
  import transMarkdownToSanitizedHtml from "$lib/utils/transHtml";
  import { pickRandomElementsFromObject } from "$lib/utils/collections";
  import IconButton from "$lib/components/IconButton.svelte";
  import SelectModelModal from "$lib/components/modals/SelectModelModal.svelte";
  import ChatLogModal from "$lib/components/modals/ChatLogModal.svelte";
  import type { PokePrompt } from "$lib/constants/poke";

  export let data: {
    pokePrompts: Record<number, PokePrompt>;
    initialGuide: string;
  };

  let currentModelName: string | null = null;
  const FailedAiOutput = "今日はもう、つかれちゃったよ...";

  let chatHistory: Chat[] = [];
  let currentUserInput: string | null = null;
  let currentAiOutput = data.initialGuide;
  let turnCounter = 0;
  let gameStatus: GameStatus = "init";
  let isProcessing = false;
  async function sendMessage() {
    let userInput: Array<string | Part>;
    if (currentUserInput === null) {
      userInput = [currentPokeData.prompt, currentPokeData.imagePart];
    } else if (currentUserInput.trim() === "") {
      return;
    } else {
      userInput = [currentUserInput];
    }
    isProcessing = true;
    currentUserInput = "";
    turnCounter += 1;
    console.debug("turn:", turnCounter);
    gameStatus = decideGameStatus(turnCounter);

    let aiOutput: string | null;
    aiOutput = await fetchChatReply(window.fetch, currentModelName, chatHistory, userInput);
    if (!aiOutput) {
      aiOutput = FailedAiOutput;
      turnCounter += 99;
    }
    chatHistory = [...chatHistory, { role: "user", parts: userInput }, { role: "model", parts: [aiOutput] }];

    currentAiOutput = await transMarkdownToSanitizedHtml(aiOutput);
    playAudio();
    isProcessing = false;
  }

  type GameStatus = "init" | "onGame" | "gameOver" | "unknown";
  function decideGameStatus(turn: number): GameStatus {
    switch (true) {
      case turn > 0:
        return "onGame";
      case turn === 0:
        return "init";
      default:
        return "unknown";
    }
  }

  function resetGame() {
    isOpen = false;
    chatHistory = [];
    turnCounter = 0;
    gameStatus = decideGameStatus(turnCounter);
    currentUserInput = "";
    currentAiOutput = data.initialGuide;
  }

  let currentPokeData: PokePrompt;
  let playAudio: () => void;
  async function startGame() {
    resetGame();
    currentUserInput = null;
    currentPokeData = pickRandomElementsFromObject(data.pokePrompts, 1)[0];
    playAudio = await initAudio(currentPokeData.oggUrl);
    sendMessage();
  }

  const fullText = "......??????";
  let index = 0;
  let processingMessage = fullText[index];
  let interval: ReturnType<typeof setInterval>;
  function updateProcessingMessage() {
    if (isProcessing) {
      if (index < fullText.length) {
        processingMessage += fullText[index];
        index++;
      } else {
        clearInterval(interval);
      }
    } else {
      index = 0;
      processingMessage = fullText[index];
    }
  }
  onMount(() => {
    interval = setInterval(updateProcessingMessage, 500);
  });
  onDestroy(() => {
    clearInterval(interval);
  });

  let isOpen = false;
  async function openImage() {
    isOpen = true;
    const playAudio = await initAudio(currentPokeData.oggUrl);
    playAudio();
  }

  // モーダル表示
  const modalStore = getModalStore();
  function modalSettings(modalComponent: ModalComponent): ModalSettings {
    return {
      type: "component",
      component: modalComponent,
      backdropClasses: "fixed inset-0 !bg-gray-300/90",
    };
  }

  function showSelectModelModal(): void {
    const modalComponent: ModalComponent = {
      ref: SelectModelModal,
      props: {
        currentModelName: currentModelName,
        selectModel: _selectModel,
      },
    };
    function _selectModel(selectedModelName: string): void {
      currentModelName = selectedModelName;
    }
    const m = modalSettings(modalComponent);
    modalStore.trigger(m);
  }

  function showChatLogModal(): void {
    const modalComponent: ModalComponent = {
      ref: ChatLogModal,
      props: {
        chatHistory: chatHistory,
      },
    };
    const m = modalSettings(modalComponent);
    modalStore.trigger(m);
  }

  /* eslint-disable svelte/no-at-html-tags */
  /* {@html}ディレクティブ を使う前は必ずサニタイズすること！ */
</script>

<div class="cRouteBodyStyle">
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">ポケモンだ〜れだ？ 改</h1>
  </div>

  <div class="cContentPartStyle !mt-1 !ml-1 !mr-1">
    <!-- 上部ボタン -->
    <div class="flex items-center justify-between space-x-2 ml-8 mr-8">
      <IconButton icon="mdi:search" cButton="btn-sm" onClick={showSelectModelModal} />
      <div class="flex-grow"><!--spacer--></div>
      <IconButton icon="mdi:restart" cButton="btn-sm" onClick={resetGame} />
      <IconButton icon="mdi:forum-outline" cButton="btn-sm" onClick={showChatLogModal} />
    </div>

    <!-- Pokenator 表示 -->
    <div class="m-4">
      <div class="flex flex-col items-center justify-center">
        <div class="w-24 h-24 mb-1">
          {#if isOpen}
            <img src={currentPokeData?.imageUrl} alt="Pokenator" class="w-full h-full object-contain" />
          {:else}
            <Icon icon="mdi:help" class="w-full h-full" />
          {/if}
        </div>
        <div class="cSpeechBubbleHeaderStyle" />
        <div class="cSpeechBubbleBodyStyle">
          {#if isProcessing}
            <span>{processingMessage}</span>
          {:else}
            <span>{@html `${currentAiOutput}`} </span>
          {/if}
        </div>
      </div>
    </div>

    <!-- 下部ボタン -->
    <div class="flex items-center justify-center space-x-2">
      {#if gameStatus === "init"}
        <button type="button" on:click={startGame} class="btn variant-filled"> はじめる </button>
      {:else if gameStatus === "onGame"}
        <div class="flex flex-col space-y-2">
          <div>
            <input
              id="message"
              type="text"
              class="text-surface-900 rounded"
              bind:value={currentUserInput}
              placeholder="質問"
            />
            <button type="button" on:click={sendMessage} class="btn variant-filled"> たずねる </button>
          </div>
          <div class="flex items-center justify-center">
            <button type="button" on:click={openImage} class="btn variant-filled"> こたえをみる </button>
          </div>
        </div>
      {:else if gameStatus === "gameOver"}
        <button type="button" on:click={startGame} class="btn variant-filled"> もう一度 </button>
      {:else}
        <button type="button" on:click={resetGame} class="btn variant-filled"> リセット </button>
      {/if}
    </div>
  </div>
</div>
