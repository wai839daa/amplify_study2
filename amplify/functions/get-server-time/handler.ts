//サーバタイム取得関数の本体
export const handler = async () => {
  // サーバー上の正確な現在時刻をISO形式で取得
  const serverTime  = new Date().toISOString(); 
  
  return {
    time: serverTime 
  };
}

