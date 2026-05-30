import { defineFunction } from "@aws-amplify/backend";

//サーバタイム取得関数のリソース定義
export const getServerTime  = defineFunction({
  name: 'get-server-time',
  entry: './handler.ts' // 同一フォルダ内の handler.ts を指定
});
