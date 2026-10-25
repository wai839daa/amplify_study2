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
const client = generateClient<Schema>();

//計算画面
// 親コンポーネントから「戻る機能」等を受け取るための型定義
interface AFrameProps {
  userAnswer:string;
  setUserAnswer:(value:string) => void;
// memo:string;
// setMemo: (value: string) => void;
  onBack: () => void;
  currentScreen:'frameHome' | 'frameKeisan';
  setCurrentScreen: (value:'frameHome' | 'frameKeisan') => void;
  //setCurrentScreen: (value:string) => void;
  handleGetServerTime: (flg:number)=>void;
  START:number;
  END:number;
  isRunning:boolean;
  startTime:string|null;
  endTime:string|null;
  diffTime:string;
  seikaiCnt:string;
  misuCnt:string;
  seitouRitu:string;
  sahen:number;
  uhen:number;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>)=>void;
  results: Array<Schema["Result2"]["type"]>;
  result:string;
////9月14日追加
  setStartTime: (value: string) => void;
  setEndTime: (value: string) => void;
  setDiffTime: (value: string) => void;
  setSeikaiCnt: (value: string) => void;
  setMisuCnt: (value: string) => void;
  setSeitouRitu: (value: string) => void;
  setSahen: (value: number) => void;
  setUhen: (value: number) => void;
  setResults:(value:Array<Schema["Result2"]["type"]>) => void;
  setResult: (value: string) => void;
}

// 計算画面
//export default function FchgKeisan({ userAnswer,setUserAnswer,memo,setMemo,handleGetServerTime,handleKeyDown,START,END,isRunning,startTime,endTime,diffTime,seikaiCnt,misuCnt,seitouRitu,sahen,uhen,results,result,onBack,setCurrentScreen,setStartTime,setEndTime,setDiffTime,setSeikaiCnt,setMisuCnt,setSeitouRitu,setSahen,setUhen,setResults,setResult }: AFrameProps) {
export default function FchgKeisan({ userAnswer,setUserAnswer,handleGetServerTime,handleKeyDown,START,END,isRunning,startTime,endTime,diffTime,seikaiCnt,misuCnt,seitouRitu,sahen,uhen,results,result,onBack,setCurrentScreen,setStartTime,setEndTime,setDiffTime,setSeikaiCnt,setMisuCnt,setSeitouRitu,setSahen,setUhen,setResults,setResult }: AFrameProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h1>計算画面</h1>

      {/* 複雑なフォームやデータ表示などをここに配置 */}
      <div style={{ padding: '20px' }}>
        <div>
          <input
            type="button"
            value="開始"
    //NG    onClick={(fnc:Function=setStartTime)=>handleGetServerTime(fnc)} //アロー関数の引数には自動的にクリックイベントのデータが入るとのこと。従って空にしておくべし。
            onClick={()=>handleGetServerTime(START)}
          />
          {/* 終了ボタン（開始ボタンが押されるまで無効化） */}
          <input
            type="button"
            value="終了"
            onClick={()=>{handleGetServerTime(END);}}
            disabled={!isRunning}
          />

          {/* 開始時刻等の表示 */}
          {startTime && (
            <p style={{ marginTop: "1.5rem", fontSize: "18px" }}>
              開始時刻: <strong>{startTime}</strong>
              {endTime && <p>終了時刻: <strong>{endTime}</strong></p>}
              {diffTime && <p>経過時間: <strong>{diffTime}</strong></p>}
              {seikaiCnt && <p>正解: <strong>{seikaiCnt}回</strong>、不正: <strong>{misuCnt}回</strong>、正答率: <strong>{seitouRitu}％</strong></p>}
            </p>
          )}
        </div>
          {/* 3. 表示部分 */}
        <span >{sahen} + {uhen} = </span> 
        
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)} // 入力内容を同期
          onKeyDown={handleKeyDown} // Enterキーを監視
          placeholder="答えを入力"
          disabled={!isRunning}
        />
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          {result}
        </div>
      
        <ul>
            {results.map((result2) => (
              <li key={result2.id}>{result2.saen + ' ' + result2.siki + ' ' + result2.uhen + ' = ' + result2.answer + '＜' + result2.seikai + '＞' + ((result2.answer == result2.seikai) ? '正解！' : '残念、不正解')}</li>
            ))}
          </ul>

      </div>
      
      <button onClick={onBack} style={{ marginTop: '20px' }}>
        開始画面に戻る
      </button>
    </div>
  );
}


