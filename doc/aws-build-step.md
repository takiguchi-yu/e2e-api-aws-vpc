## AWS 構築手順

### シークレットマネージャ

E2E テスト用の API_KEY を登録します。

### 設定ファイルの更新

必要に応じて `cdk/parameter.ts` を更新してください。

### デプロイ

```sh
# 構文チェック
cdk synth --profile <YOUR-PROFILE>
# デプロイ
cdk deploy --require-approval never --profile <YOUR-PROFILE>
```

### Chatbot 設定

CodeBuild の実行結果を Slack 通知するための設定をします。

1. Chatbot を作成します。
2. CodeBuild に設定します。

### ビルドのトリガー設定

毎朝 8:00 にスケジュール起動する設定を入れます。
