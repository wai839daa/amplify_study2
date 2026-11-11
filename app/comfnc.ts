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


///////////////////////////////////////////
//サーバ時刻取得（開始、終了の共通処理)
///////////////////////////////////////////
export const com_calcTime = (et:string, st:string):string => {
    //時刻型に変換
    const dte = new Date(et);
    const dts = new Date(st);

    //ミリ秒計算
    const diffMs = dte.getTime() - dts.getTime();

    // ミリ秒を時間（時間・分・秒）に変換
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSec = Math.floor((diffMs % (1000 * 60)) / 1000);

    return diffHours + ":" + diffMins+ ":" + diffSec ;
}


///////////////////////////////////////////
//上限、下限範囲のランダムな整数を返す関数
///////////////////////////////////////////
const KAGEN:number = 1;
const JOUGEN:number = 100;

export function com_getRandomInt(min:number=KAGEN, max:number=JOUGEN) :number {
const minCeiled = Math.ceil(min);
const maxFloored = Math.floor(max);
return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 上限は除き、下限は含む
}

///////////////////////////////////////////
// DB書き込み
///////////////////////////////////////////
export async function com_write(p_uhen:number, p_sahen:number, p_siki:string, p_seikai:number, p_answer:number){
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
  
    if (errors) console.log("Result2_作成失敗:errors== " + errors + ",newResult==" + newResult);
    else console.log("Result2_作成成功:", newResult);
};


///////////////////////////////////////////
//DB内容を取得
///////////////////////////////////////////
export async function com_read(p_time: string) { //複数ページで返された場合を考慮
//  let allLists: any[] = [];
    let allLists: Array<Schema["Result2"]["type"]> = [];
    let currentToken: string | null | undefined = null;

    do {
        const readResult:any = await client.models.Result2.list({
            filter: {
                createdAt: {
                gt: p_time // 「指定時刻より大きい（以降）」という条件
                },
            },
    nextToken: currentToken //APIパラメタには、前回実行時のAPI返り値をセットする。
    });

        if (readResult.errors) {
            console.log("list関数_失敗:errors== ", readResult.errors);
            break;
        }

        allLists = allLists.concat(readResult.data);
        currentToken = readResult.nextToken ; // 次のページがある場合は、API返り値のトークンがセットされる

    } while (currentToken);

    console.log("すべての取得データ:", allLists);
    return allLists;
}


