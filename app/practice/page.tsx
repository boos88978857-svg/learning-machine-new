"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listInProgressSessions,
  removeSession,
  getActiveSessionId,
  setActiveSessionId,
  PracticeSession
} from "../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 16,
  padding: 16
};

const btn: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #e0e0e0",
  background: "#fff",
  fontWeight: 900,
  textDecoration: "none",
  color: "#111",
  cursor: "pointer"
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  borderColor: "#111",
  background: "#111",
  color: "#fff"
};

const pill: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid #e6e6e6",
  background: "#fff",
  fontWeight: 900,
  whiteSpace: "nowrap",
  fontSize: 14
};

export default function PracticeHubPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  function refresh() {
    setSessions(listInProgressSessions());
    setActiveId(getActiveSessionId());
  }

  useEffect(() => {
    refresh();
  }, []);

  function resume(s: PracticeSession) {
    setActiveSessionId(s.id);
    setActiveId(s.id);
    window.location.href = `/practice/session?id=${encodeURIComponent(s.id)}`;
  }

  function clearOne(id: string) {
    removeSession(id);
    refresh();
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px" }}>
        學習區（續做中心）
      </h1>

      <p style={{ margin: "0 0 16px", opacity: 0.8, lineHeight: 1.7 }}>
        這裡只負責「做到一半可續做」：你可以同時有多個科目的未完成回合，並選擇繼續或清除。
      </p>

      {/* 未完成清单 */}
      {sessions.length === 0 ? (
        <div style={card}>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            目前沒有未完成進度。<br />
            （正式流程：請先從各科目選擇階段/年級後開始作答，這裡才會出現續做項目）
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {sessions.map((s) => (
            <div key={s.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>{s.subject}</h2>
                {activeId === s.id ? <span style={{ ...pill, borderColor: "#111" }}>目前作答中</span> : null}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={pill}>
                  進度：第 {s.currentIndex + 1} 題 / {s.totalQuestions}
                </span>
                <span style={pill}>⏱ {formatTime(s.elapsedSec)}</span>
                <span style={pill}>
                  對：{s.correctCount} / 錯：{s.wrongCount}
                </span>
                <span style={pill}>
                  提示：{s.hintLimit}/{s.hintUsed}
                </span>
                <span style={pill}>{s.paused ? "已暫停" : "進行中"}</span>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <button onClick={() => resume(s)} style={btnPrimary}>
                  繼續 →
                </button>
                <button onClick={() => clearOne(s.id)} style={btn}>
                  清除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Link href="/" style={btn}>
          ← 回首頁
        </Link>
      </div>
    </main>
  );
}