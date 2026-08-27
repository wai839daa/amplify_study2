"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
//CSSインポートエラーが生じる時は、global.d.tsというファイルを生成し、declare module "*.css";の１行を記載する。
//import "./../app/app.css";
import "./app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
//import "@aws-amplify/ui-react/dist/styles.css";
import { MutualAuthenticationMode } from "aws-cdk-lib/aws-elasticloadbalancingv2";

Amplify.configure(outputs);

// ==========================================
// 1. A画面（親から memo と setMemo を受け取る）
// ==========================================
interface AFrameProps {
  memo: string; // メモの値を受け取る型
  setMemo: (value: string) => void; // メモを更新する関数を受け取る型
  onBack: () => void;
}

function AFrame({ memo, setMemo, onBack }: AFrameProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h1>A画面</h1>
      <input
        type="text"
        value={memo} // 親から届いた memo を使う
        onChange={(e) => setMemo(e.target.value)} // 親の setMemo を呼び出す
                placeholder="メモ"
      />
      <button onClick={onBack} style={{ marginTop: '20px', display: 'block' }}>
        開始画面に戻る
      </button>
    </div>
  );
}

// ==========================================
// 2. メインのアプリケーション画面（ここで共通管理する）
// ==========================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'screenA'>('home');
  
  // 変更：共有したい変数は、一番上の親（App）で定義する！
  const [memo, setMemo] = useState<string>('');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {currentScreen === 'home' ? (
        // 開始画面
        <div>
          <h1>開始画面</h1>
          {/* 確認用：開始画面でも A画面で入力したメモが表示・参照できる */}
          <p>現在のメモ内容: {memo || '（まだ未入力です）'}</p>

                    <button onClick={() => setCurrentScreen('screenA')}>
            A画面ボタン
          </button>
        </div>
      ) : (
        // A画面（定義した memo と setMemo を渡してあげる）
        <AFrame 
          memo={memo} 
          setMemo={setMemo} 
          onBack={() => setCurrentScreen('home')} 
        />
      )}
    </div>
  );
}
