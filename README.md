# trial-gemini-api

`gh-pages` ブランチの静的アセットを Github Pages で公開する。

## ローカルでの起動方法

- 各種クレデンシャル情報の登録

  ```sh
  echo "GEMINI_API_KEY=(Your API Key)" >> .env
  echo "OAUTH2_CLIENT_SECRET=(Client Secret)" >> .env
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
  firebase functions:config:set api.geminiapikey="(Your API Key)"
  firebase functions:config:set api.oauthclientsecret="(Client Secret)"
  firebase deploy --only functions
  ```

- SPA のビルドと Firebase Hosting へのデプロイ

  ```sh
  (cd skeleton-app && npm run build)
  firebase deploy --only hosting
  ```

- ブラウザでアクセス

  https://okmethod-gemini-trial.web.app/

## チューニング済みモデルへのアクセス権付与

チューニング済みモデルは個人に紐づく非公開リソースであるため、APIキーのみでは利用できない。  
https://ai.google.dev/gemini-api/docs/oauth


他ユーザが利用できる状態にするためには、下記の作業を要する。

- システム側の設定（事前に作業する）
  - モデルへのアクセス権の付与
  - ~~OAuth同意画面へのテストユーザ登録（テストモードの場合）~~
  
- ~~ユーザの操作（アプリ側に認証フローを構築）~~
  - ~~Googleアカウントの認証（ログイン）~~
  - ~~OAuth同意画面での同意~~

※ モデルの権限を `"granteeType": "EVERYONE"` に付与すれば、ユーザ個別の認証は不要になる。

### モデルへのアクセス権の付与

https://ai.google.dev/api/tuning/permissions

```sh
export CLIENT_SECRET_JSON="(json file path)"
export SCOPES="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/generative-language.tuning,https://www.googleapis.com/auth/generative-language.retriever"
gcloud auth application-default login \
    --client-id-file=$CLIENT_SECRET_JSON \
    --scopes="$SCOPES"
export ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  https://www.googleapis.com/oauth2/v1/tokeninfo 

curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  https://generativelanguage.googleapis.com/v1beta/tunedModels \
  | jq '.tunedModels[].name'

export MODEL_NAME="tunedModels/xxxx"

export REQUEST_BODY=$(cat <<EOF
{
  "granteeType": "EVERYONE",
  "role": "READER"
}
EOF
)

curl -X POST \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${REQUEST_BODY}" \
  "https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}/permissions"

curl \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}/permissions"

```

### OAuth同意画面へのテストユーザ登録

「APIとサービス」 -> 「OAuth 同意画面」 -> 「テストユーザ」
https://console.cloud.google.com/apis/credentials/consent
