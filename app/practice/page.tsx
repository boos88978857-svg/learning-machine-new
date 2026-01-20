"use client";

import { useEffect, useState } from "react";
import { clearSession, getSession, Subject } from "../../lib/session";

type CardState = {
  subject: Subject;
  hasSession: boolean;
  summary?: {
    currentIndex: number;
    totalQuestions: number;
    elapsedSec: number;
    correctCount: number;
    wrongCount: number;
    hintUsed: number;
    hintLimit: number;
    paused: boolean;
  };
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PracticePage() {
  const [cards, setCards] = useState<CardState[]>([]);

  function refresh() {
    const subjects: Subject[] = ["英文", "數學", "其他"];
    const next: CardState[] = subjects.map((sub) => {
      const s = getSession(sub);
      return {
        subject: sub,
        hasSession: !!s,
        summary: s
          ? {
              currentIndex: s.currentIndex,
              totalQuestions: s.totalQuestions,
              elapsedSec: s.elapsedSec,
              correctCount: s.correctCount,
              wrongCount: s.wrongCount,
              hintUsed: s.hintUsed,
              hintLimit: s.hintLimit,
              paused: s.paused
            }
          : undefined
      };
    });
    setCards(next);
  }

  useEffect(() => {
    refresh();
  }, []);

  function onResume(subject: Subject) {
    // 之後我們會做真正的作答頁：/practice/session
    // 先用固定路由（下一步會建立）
    window.location.href = `/practice/session?subject=${encodeURIComponent(subject)}`;
  }

  function onClear(subject: Subject) {
    clearSession(subject);
    refresh();
  }

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 16px"
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>學習區</h1>

      <p style={{ lineHeight: 1.7, margin: "0 0 18px", opacity: 0.8 }}>
        這裡只負責「續做中心」：顯示你有哪些科目做到一半，可續做或清除。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16
        }}
      >
        {cards.map((c) => (
          <div
            key={c.subject}
            style={{
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              padding: 16
            }}
          >
            <h2 style={{ margin: "0 0 8px" }}>{c.subject}專區</h2>

            {!c.hasSession ? (
              <p style={{ margin: 0, opacity: 0.7 }}>
                尚未開始或沒有未完成進度
              </p>
            ) : (
              <>
                <div style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.85 }}>
                  <div>
                    進度：第 {c.summary!.currentIndex + 1} 題 /{" "}
                    {c.summary!.totalQuestions}
                  </div>
                  <div>時間：{formatTime(c.summary!.elapsedSec)}</div>
                  <div>
                    對：{c.summary!.correctCount} / 錯：{c.summary!.wrongCount}
                  </div>
                  <div>
                    提示：{c.summary!.hintLimit}/{c.summary!.hintUsed}
                  </div>
                  <div>狀態：{c.summary!.paused ? "已暫停" : "進行中"}</div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  <button
                    onClick={() => onResume(c.subject)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 14,
                      border: "1px solid #111",
                      background: "#111",
                      color: "#fff",
                      fontWeight: 900,
                      cursor: "pointer"
                    }}
                  >
                    繼續 →
                  </button>

                  <button
                    onClick={() => onClear(c.subject)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 14,
                      border: "1px solid #e0e0e0",
                      background: "#fff",
                      fontWeight: 900,
                      cursor: "pointer"
                    }}
                  >
                    清除進度
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p style={{ marginTop: 18, opacity: 0.6 }}>
        下一步：建立 /practice/session 作答頁（先能進入，不 404）。
      </p>
    </main>
  );
}