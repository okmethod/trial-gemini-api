<script context="module" lang="ts">
  import { GoogleGenerativeAI } from "@google/generative-ai"; // クライアントサイドで実行する場合
</script>

<script lang="ts">
  import Icon from "@iconify/svelte";

  //const { GoogleGenerativeAI } = require("@google/generative-ai"); サーバサイドで実行する場合
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let text = "";
  async function run() {
    const prompt = "Write a story about an AI and magic";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();
    console.log(response.candidates);
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Example</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !mt-1 !ml-4 !mr-4">
    <!-- 入力フォーム -->
    <div class="flex items-center justify-center">
      <div class="cInputFormAndMessagePartStyle">
        <span class="text-lg">Start</span>
        <form on:submit|preventDefault={run}>
          <button type="submit" class="cIconButtonStyle">
            <div class="cIconDivStyle">
              <Icon icon="mdi:pokeball" class="cIconStyle" />
            </div>
          </button>
        </form>
      </div>
    </div>
    <div class="m-4">
      <textarea bind:value={text} class="cTextAreaStyle" rows="10" cols="50"></textarea>
    </div>
  </div>
</div>
