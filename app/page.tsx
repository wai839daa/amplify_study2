"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

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
      const seikai = sahen + uhen;
      const isCorrect = Number(userAnswer) === seikai;
      setResult(isCorrect ? "正解！" : "残念、不正解...");
      write(sahen,uhen,'+',seikai,Number(userAnswer));
      write2(sahen,uhen,'+',seikai,Number(userAnswer));
      setSahen(getRandomInt());
      setUhen(getRandomInt());
    }
  };

  // 3. 書き込み
  async function write(p_uhen:number, p_sahen:number, p_siki:string, p_seikai:number, p_answer:number){
//  const write = (uhen:number, sahen:number, siki:string, seikai:number, answer:number) => {

    console.log ('p_uhen==' + p_uhen);
    console.log (',p_sahen==' + p_sahen);
    console.log (',p_siki==' + p_siki);
    console.log (',p_seikai==' + p_seikai);
    console.log (',p_answer==' + p_answer);
    const { data: newResult, errors } = await client.models.Result2.create({
      uhen: p_uhen,
      saen: p_sahen,
      siki: p_siki,
      seikai: p_seikai,
      answer: p_answer,
      // owner フィールドは自動で入るため、指定不要です
    });
  
    //if (errors) console.error(errors);
    if (errors) console.log("Result2_作成失敗:errors== " + errors + ",newResult==" + newResult);
    else console.log("Result2_作成成功:", newResult);

  };

  async function write2(p_uhen:number, p_sahen:number, p_siki:string, p_seikai:number, p_answer:number){
    const { data: newResult, errors } = await client.models.Todo.create({
      content: 'TEST_' + p_uhen + '_' + p_sahen + '_' + p_siki + '_' + p_seikai + '_' + p_answer
      // owner フィールドは自動で入るため、指定不要です
    });
  
    if (errors) console.log("write2_Toeo_作成失敗:errors== " + errors + ",newResult==" + newResult);
    else console.log("write2_Todo_作成成功:", newResult);
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
