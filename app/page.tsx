"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function App() {

  //上限、下限範囲のランダムな整数を返す関数
  const KAGEN:number = 1;
  const JOUGEN:number = 100;
  
  function getRandomInt(min:number=KAGEN, max:number=JOUGEN) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 上限は除き、下限は含む
  }

  // 1. 各値を状態（State）として定義
  const [sahen, setSahen] = useState(getRandomInt());  // 左辺（例: 5）
  const [uhen, setUhen] = useState(getRandomInt());   // 右辺（例: 3）
  const [userAnswer, setUserAnswer] = useState(""); // ユーザーの入力値
  const [result, setResult] = useState(""); // 判定結果のメッセージ

  // 2. Enterキーが押された時の判定処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const isCorrect = Number(userAnswer) === sahen + uhen;
      setResult(isCorrect ? "正解！" : "残念、不正解...");
      setSahen(getRandomInt());
      setUhen(getRandomInt());
    }
  };

  return (
  <div style={{ padding: '20px' }}>
    {/* 3. 表示部分 */}
    <span>{sahen} + {uhen} = </span>
    
    <input
      type="text"
      value={userAnswer}
      onChange={(e) => setUserAnswer(e.target.value)} // 入力内容を同期
      onKeyDown={handleKeyDown} // Enterキーを監視
      placeholder="答えを入力"
    />

    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
      {result}
    </div>
  </div>
);

/* お試し
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      alert("OK");
    }
  };

  return (
    <main>
      <h1>脳トレ</h1>
      <div>
        <input type="text" id="sahen" name="sahen" value="1" style={{ width: '100px' }}></input>
        ＋
        <input type="text" id="uhen" name="uhen" value="2" style={{ width: '100px' }}></input>
        ＝
        <input type="text" id="kotae" name="kotae" style={{ width: '100px' }} onKeyDown={handleKeyDown} ></input>
      </div>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
*/

  /*ORG
  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
*/
}
