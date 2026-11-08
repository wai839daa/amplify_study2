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

//DB内容を取得
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


