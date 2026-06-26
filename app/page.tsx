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

  //DB内容を取得
  const [results, setResults] = useState<Array<Schema["Result2"]["type"]>>([]);  
  async function read(p_time:string){
    console.log ('p_time==' + p_time);
    const { data: lists, errors } = await client.models.Result2.list({
    filter: {
        createdAt: {
          gt: p_time // 「指定時刻より大きい（以降）」という条件
        }
      }
    });
    
    if (errors) console.log("list関数_失敗:errors== " + errors + ",lists==" + lists);
    else console.log("list関数_成功:", lists);
  
    setResults(lists);
  };

  //const targetTime = "2026-05-17T12:00:00.000Z"; 
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  //開始ボタン押下の処理
  //ローカル時刻取得の場合
  const handleStartClick_local = () => {
    const targetTime = new Date().toISOString() ;
    setStartTime(targetTime);
  };

  //サーバ時刻取得（開始、終了の共通処理)
//OK const handleGetServerTime = async (cbfnc:Function) => {  //この書き方でも動くが、大文字のFunctionは、「何でもいいから関数全般」という意味の、非常に大雑把な型で、型安全ではなくなってしまうとのこと。下記がよい。
//const handleGetServerTime = async (cbfnc:(tm:string)=>void) => {
  const START:number=0;
  const END:number=1;
  const handleGetServerTime = async (flg:number=START|END) => {
    try {
      // DynamoDBではなく、AWSサーバーの関数をダイレクトに呼び出す！
      const { data, errors } = await client.queries.getServerTime();
      console.log("サーバー時刻の取得に成功しました:", "data?.time=" + data?.time);

      if (errors || !data?.time) {
        throw new Error();
      }

      // サーバー時刻をコールバック関数で設定する。
      //cbfnc(data?.time);

      if (flg == START) {
        setStartTime(data?.time);
        setEndTime(null);
        setResults([]);
        setIsRunning(true);
        setSahen(getRandomInt());
        setUhen(getRandomInt());
      }else if(startTime != null){
        setEndTime(data?.time);
        setIsRunning(false);
        read(startTime);
      }
    } catch (error) {
      console.error("サーバー時刻の取得に失敗しました:", error);

    } finally {
    }
  };

  //サーバ時刻取得の場合
  const handleStartClick_server = async () => {
    try {
      // DynamoDBではなく、AWSサーバーの関数をダイレクトに呼び出す！
      const { data, errors } = await client.queries.getServerTime();
      console.log("サーバー時刻の取得に成功しました:", "data?.time=" + data?.time);

      if (errors || !data?.time) {
        throw new Error();
      }

      // サーバーから直接返ってきた時刻データ
//    const awsTime = data?.time; // 例: "2026-05-25T12:00:00.000Z"
//    setStartTime(new Date(awsTime).toLocaleTimeString("ja-JP"));
      setStartTime(data?.time);
      
    } catch (error) {
      console.error("サーバー時刻の取得に失敗しました:", error);
    } finally {
    }
  };

  //終了ボタン押下の処理
  const handleEndClick = () => {
    if (!startTime){ //この判定を入れないと、後のread実行で、null型は不許可のコンパイルエラーとなる。
      return;
    }
    const targetTime = new Date().toISOString() ;
    setEndTime(targetTime);
    read(startTime);
  };

  /*
  function listResults() {
  //client.models.Result2.observeQuery().subscribe({
    client.models.Result2.list({
      next: (data) => setResults([...data.items]),
       filter: {
      createdAt: {
        gt: targetTime // 「指定時刻より大きい（以降）」という条件
      }
    }
    });
  }
  useEffect(() => {
    listResults();
  }, []);
*/

  //上限、下限範囲のランダムな整数を返す関数
  const KAGEN:number = 1;
  const JOUGEN:number = 100;
  
  function getRandomInt(min:number=KAGEN, max:number=JOUGEN) :number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 上限は除き、下限は含む
  }

  // 1. 各値を状態（State）として定義
//const [sahen, setSahen] = useState(getRandomInt());  // 左辺（例: 5）
//const [uhen, setUhen] = useState(getRandomInt());   // 右辺（例: 3）
  const [sahen, setSahen] = useState(0);  // 左辺（例: 5）
  const [uhen, setUhen] = useState(0);   // 右辺（例: 3）
  const [userAnswer, setUserAnswer] = useState(""); // ユーザーの入力値
  const [result, setResult] = useState(""); // 判定結果のメッセージ

  // 2. Enterキーが押された時の判定処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (sahen != null && uhen != null){
        const seikai = sahen + uhen;
        const isCorrect = Number(userAnswer) === seikai;
        setResult(isCorrect ? "正解！ 回答="+ userAnswer : "残念、不正解...正解=" + seikai +"、回答="+ userAnswer);
        write(sahen,uhen,'+',seikai,Number(userAnswer));
//      write2(sahen,uhen,'+',seikai,Number(userAnswer));
        setSahen(getRandomInt());
        setUhen(getRandomInt());
        setUserAnswer("");
      //  read (startTime);
      }
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
    <div>
      <input
        type="button"
        value="開始"
//NG    onClick={(fnc:Function=setStartTime)=>handleGetServerTime(fnc)} //アロー関数の引数には自動的にクリックイベントのデータが入るとのこと。従って空にしておくべし。
        onClick={()=>handleGetServerTime(START)}
//      onClick={handleStartClick_server} // Enterキーを監視
      />
      {/* 終了ボタン（開始ボタンが押されるまで無効化） */}
      <input
        type="button"
        value="終了"
//      onClick={handleEndClick} // Enterキーを監視
        onClick={()=>handleGetServerTime(END)}
        disabled={!isRunning}
      />

      {/* 開始時刻等の表示 */}
      {startTime && (
        <p style={{ marginTop: "1.5rem", fontSize: "18px" }}>
          開始時刻: <strong>{startTime}</strong>
          {endTime && <p>終了時刻: <strong>{endTime}</strong></p>}
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
