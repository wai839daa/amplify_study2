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



