# Chrome 拡張機能による Slack 認証と Slack ステータス変更 API

Chrome 拡張機能を通じて Slack の認証を行い、Slack のステータスを変更するための API です

## 概要

このシステムは、Slack API を利用して以下の機能を提供します：

1. Chrome 拡張機能からの Slack 認証
2. Slack ステータスの変更

## 構築手順

1. **リポジトリのクローン**

   ```bash
   git clone git@github.com:fukuhito015/slack-status-updater.git
   cd slack-status-updater
   ```

2. **必要なパッケージをインストール**

   ```bash
   npm i
   ```

3. **環境変数の設定**

   プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の環境変数を設定します：

   ```plaintext
   SLACK_CLIENT_ID=your_slack_client_id
   SLACK_CLIENT_SECRET=your_slack_client_secret
   CHROME_EXTENSION_APP_URL=your_chrome_extension_redirect_url
   PORT=your_server_port
   ```

4. **サーバーの起動**

   ```bash
   npm run start
   ```

## 環境変数

- `SLACK_CLIENT_ID`：Slack アプリのクライアント ID
- `SLACK_CLIENT_SECRET`：Slack アプリのクライアントシークレット
- `CHROME_EXTENSION_APP_URL`：Chrome 拡張機能のリダイレクト URL
- `PORT`：リッスンポート

## エンドポイント

### `/slack-api/authorize`

Slack 認証画面にリダイレクトします。

### `/slack-api/exchange`

Slack の認可コードからアクセストークンを取得します。

### `/slack-api/status`

Slack のステータスを更新します。

- **リクエストボディ**：
  ```json
  {
    "statusText": "Your status text",
    "emoji": ":your_emoji:",
    "slackToken": "xoxp-your-slack-token"
  }
  ```

## 使用例

1. ブラウザから https://xxxxx/slack-api/authorize にアクセスし、Slack 認証を行います。
2. 認証後にリダイレクトされる URL に含まれる認可コードを取得します。
3. POST /slack-api/exchange に認可コードを送信し、アクセストークンを取得します。
4. POST /slack-api/status にアクセストークン、ステータスのテキスト、絵文字を送信し、Slack のステータスを更新します。
