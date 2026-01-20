"use client";

import { useState } from "react";
import { newSession, Subject, upsertSession, clearAllSessions } from "../../../lib/session";
import { useRouter } from "next/navigation";

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #e0e0e0",
  background: "#fff",
  fontWeight: 900,
  cursor: "pointer"
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  borderColor: "#111",
  background: "#111",
  color: "#fff"
};

export default function PracticeDebugPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  function make(subject: Subject) {
    const s = newSession(subject);
    // 造一个“做到一半”的样子
    s.currentIndex = 5; // 第 6 题
    s.elapsedSec = 125; // 02:05
    s.correctCount = 3;
    s.wrongCount = 2;
    s.hintUsed = 1;
    s.paused = false;
    upsertSession(s);
    setMsg(`已建立 ${subject} 測試進度（回到學習區可看到「繼續/清除」）`);
  }

  function clear(subject: Subject) {
    clearSession(subject);
    setMsg(`已清除 ${subject} 進度`);
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 10px" }}>
        （測試用）建立續做進度
      </h1>

      <p style={{ opacity: 0.75, lineHeight: 1.7, marginTop: 0 }}>
        這頁只給你測試「學習區續做中心」是否正常。正式版本會移除。
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => make("英文")} style={btnPrimary}>
          建立 英文 進度
        </button>
        <button onClick={() => make("數學")} style={btnPrimary}>
          建立 數學 進度
        </button>
        <button onClick={() => make("其他")} style={btnPrimary}>
          建立 其他 進度
        </button>

        <button onClick={() => clear("英文")} style={btn}>
          清除 英文
        </button>
        <button onClick={() => clear("數學")} style={btn}>
          清除 數學
        </button>
        <button onClick={() => clear("其他")} style={btn}>
          清除 其他
        </button>

        <button onClick={() => router.replace("/practice")} style={btn}>
          ← 回學習區
        </button>
      </div>

      {msg ? (
        <div
          style={{
            marginTop: 14,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 14,
            fontWeight: 900
          }}
        >
          {msg}
        </div>
      ) : null}
    </main>
  );
}