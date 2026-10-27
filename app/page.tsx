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
import { MutualAuthenticationMode } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import FchgKeisan from "./FchgKeisan";  //計算画面用

Amplify.configure(outputs);
const client = generateClient<Schema>();


export default function App() {

  //画面切り替え用変数
  const [currentScreen, setCurrentScreen] = useState<'frameHome' | 'frameKeisan'>('frameHome');
//const [currentScreen, setCurrentScreen] = useState('frameHome');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {currentScreen === 'frameHome' ? (
        // 開始画面
        <div>
          <h1>開始画面</h1>
          <p>ようこそ！下のボタンを押してください。</p>
          <button onClick={() => setCurrentScreen('frameKeisan')}>
            計算画面ボタン
          </button>
        </div>
      ) : (
        // 計算画面（関数を呼び出し、戻る処理を Props で渡す）
//      <FchgKeisan userAnswer={userAnswer} setUserAnswer={setUserAnswer} memo={memo} setMemo={setMemo} handleGetServerTime={handleGetServerTime} handleKeyDown={handleKeyDown} START={START} END={END} isRunning={isRunning} startTime={startTime} endTime={endTime} diffTime="" seikaiCnt="" misuCnt="" seitouRitu="" sahen={sahen} uhen={uhen} results={results} result={result} onBack={() => setCurrentScreen('frameHome')} currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} setStartTime={setStartTime} setEndTime={setEndTime} setDiffTime={setDiffTime} setSeikaiCnt={setSeikaiCnt} setMisuCnt={setMisuCnt} setSeitouRitu={setSeitouRitu} setSahen={setSahen} setUhen={setUhen} setResults={setResults} setResult={setResult} />
//      <FchgKeisan userAnswer={userAnswer} setUserAnswer={setUserAnswer} handleGetServerTime={handleGetServerTime} handleKeyDown={handleKeyDown} START={START} END={END} isRunning={isRunning} startTime={startTime} endTime={endTime} diffTime="" seikaiCnt="" misuCnt="" seitouRitu="" sahen={sahen} uhen={uhen} results={results} result={result} onBack={() => setCurrentScreen('frameHome')} currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} setStartTime={setStartTime} setEndTime={setEndTime} setDiffTime={setDiffTime} setSeikaiCnt={setSeikaiCnt} setMisuCnt={setMisuCnt} setSeitouRitu={setSeitouRitu} setSahen={setSahen} setUhen={setUhen} setResults={setResults} setResult={setResult} />
//      <FchgKeisan onBack={() => setCurrentScreen('frameHome')} currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}  />
        <FchgKeisan onBack={() => setCurrentScreen('frameHome')} />
      )}
    </div>
  );
}
