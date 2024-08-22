<script context="module" lang="ts">
  import { GoogleGenerativeAI } from "@google/generative-ai"; // クライアントサイドで実行する場合
</script>

<script lang="ts">
  //const { GoogleGenerativeAI } = require("@google/generative-ai"); サーバサイドで実行する場合
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const initialPrompt = `
あなたはポケモンの博士です。
私は、特定の1匹のポケモンの思い浮かべています。
あなたは、そのポケモンが何かを当てるために質問をしてください。
ただし、質問は「はい」または「いいえ」で回答できるものにしてください。
十分な情報が揃ったと判断したら、そのポケモンの名前を当ててください。
`;

  let chatHistory: { role: "user" | "model"; parts: string }[] = [];
  let userInput = "";
  async function sendMessage() {
    if (userInput.trim() === "") return;
    const chat = model.startChat({
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
      <div class="chat-history">
        <div class="p-2 bg-gray-100 rounded">
          <span>chat history</span>
          {#each chatHistory.slice(1) as chat}
            <div class={chat.role === "user" ? "user-message" : "ai-message"}>
              <strong>{chat.role === "user" ? "You" : "AI"}:</strong>
              {chat.parts}
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="m-4">
      <div class="user-input">
        <input type="text" bind:value={userInput} placeholder="Type your message..." />
        <button on:click={sendMessage} class="cIconButtonStyle">
          <div class="cSpanDivStyle">
            <span> Send </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
