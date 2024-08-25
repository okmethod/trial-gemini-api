# trial-gemini-api

`gh-pages` ブランチの静的アセットを Github Pages で公開する。

## ローカルでの起動方法

- 各種クレデンシャル情報の登録

  ```sh
  echo "GEMINI_API_KEY=(Your API Key)" >> .env
  echo "OAUTH2_CLIENT_ID=(Your ID)" >> .env
  echo "OAUTH2_CLIENT_SECRET=(Your Secret)" >> .env
  ```

- コンテナ起動

  ```sh
  docker compose up
  ```

- ブラウザでアクセス

  http://localhost:5173/

## インターネットへの公開方法

- Gemini APIキーの登録と Firebase Functions へのデプロイ

  ```sh
  firebase functions:config:set api.key="(Your API Key)"
  firebase deploy --only functions
  ```

- SPA のビルドと Firebase Hosting へのデプロイ

  ```sh
  (cd skeleton-app && npm run build)
  firebase deploy --only hosting
  ```

- ブラウザでアクセス

  https://okmethod-gemini-trial.web.app/
