<script lang="ts">
  import type { GenerativeModel } from "@google/generative-ai";
  import initialPrompt from "./initialPrompt";

  export let data: {
    model: GenerativeModel;
  };

  let chatHistory: { role: "user" | "model"; parts: string }[] = [];
  let userInput = "";
  async function sendMessage() {
    if (userInput.trim() === "") return;
    const chat = data.model.startChat({
      history: chatHistory.map((chat) => ({
        role: chat.role,
        parts: [{ text: chat.parts }],
      })),
    });
    const response = await chat.sendMessage(userInput);
    chatHistory = [...chatHistory, { role: "user", parts: userInput }];
    userInput = "";

    const aiMessage = response.response.text();
    chatHistory = [...chatHistory, { role: "model", parts: aiMessage }];
  }

  function reset() {
    chatHistory = [];
    userInput = initialPrompt;
    sendMessage();
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Pokenator</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !mt-1 !ml-4 !mr-4">
    <!-- ボタン -->
    <div class="flex items-center justify-center space-x-2">
      <div class="cInputFormAndMessagePartStyle">
        <form
          on:submit|preventDefault={() => {
            userInput = "はい";
            sendMessage();
          }}
        >
          <button type="submit" class="cIconButtonStyle">
            <div class="cSpanDivStyle">
              <span> Yes </span>
            </div>
          </button>
        </form>
      </div>
      <div class="cInputFormAndMessagePartStyle">
        <form
          on:submit|preventDefault={() => {
            userInput = "いいえ";
            sendMessage();
          }}
        >
          <button type="submit" class="cIconButtonStyle">
            <div class="cSpanDivStyle">
              <span> No </span>
            </div>
          </button>
        </form>
      </div>
      <div class="cInputFormAndMessagePartStyle">
        <form on:submit|preventDefault={reset}>
          <button type="submit" class="cIconButtonStyle">
            <div class="cSpanDivStyle">
              <span> Reset </span>
            </div>
          </button>
        </form>
      </div>
    </div>
    <div class="m-4">
      <div class="p-2 w-96 h-96 overflow-y-scroll bg-gray-100 rounded">
        {#each chatHistory.slice(1) as chat}
          <div class={chat.role === "user" ? "user-message" : "ai-message"}>
            <strong>{chat.role === "user" ? "You" : "AI"}:</strong>
            {chat.parts}
          </div>
        {/each}
      </div>
    </div>
    <div class="m-4">
      <div class="flex items-center justify-center space-x-2">
        <input id="message" type="text" class="rounded" bind:value={userInput} placeholder="Type your message..." />
        <button on:click={sendMessage} class="cIconButtonStyle">
          <div class="cSpanDivStyle">
            <span> Send </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
