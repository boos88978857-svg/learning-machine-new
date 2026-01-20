"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  newSession,
  Subject,
  upsertSession,
  clearAllSessions
} from "../../../lib/session";

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
  background: "#111",
  borderColor: "#111",
  color: "#fff"
};

export default function PracticeDebugPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  function make(subject: Subject) {
    // ✅ 建立最小 session（不塞不存在字段，避免类型红灯）
    const s = newSession(subject, 20);

    // ✅ 放一个“看得出来有进度”的假数据（只写 session.ts 有的字段）
    const next = {
      ...s,
      currentIndex: 5,
      elapsedSec: 125,
      hintUsed: 1
    };

    upsertSession(next);
    setMsg(`已建立「${subject}」測試進度（到學習區可看到續做項目）`);
  }

  function clearAll() {
    clearAllSessions();
    setMsg("已清除所有進度");
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 900 }}>
        Debug（開發用）
      </h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => make("英文")} style={btnPrimary}>
          建立 英文 測試進度
        </button>

        {/* ⚠️ 这里用 Subject 允许的字：如果你 session.ts 是「数学」(简体)，就必须用数学 */}
        <button onClick={() => make("數學")} style={btnPrimary}>
          建立 數學 測試進度
        </button>

        <button onClick={() => make("其他")} style={btnPrimary}>
          建立 其他 測試進度
        </button>

        <button onClick={clearAll} style={btn}>
          清除全部進度
        </button>

        <button onClick={() => router.replace("/practice")} style={btn}>
          前往學習區（續做中心）
        </button>
      </div>

      {msg ? (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            border: "1px solid #e6e6e6",
            background: "#fff",
            fontWeight: 900
          }}
        >
          {msg}
        </div>
      ) : null}

      <p style={{ marginTop: 14, opacity: 0.75, lineHeight: 1.7 }}>
        ※ 這頁只用於測試「續做」流程：建立進度 → 到學習區看到未完成 → 點繼續進入作答頁。
      </p>
    </main>
  );
}