"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, newSession, Subject, upsertSession } from "../../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function isSubject(v: string): v is Subject {
  return v === "英文" || v === "數學" || v === "其他";
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const subject = useMemo(() => {
    const raw = sp.get("subject") ?? "";
    const decoded = decodeURIComponent(raw);
    return decoded;
  }, [sp]);

  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintLimit, setHintLimit] = useState(5);
  const [hintUsed, setHintUsed] = useState(0);

  // 1) 讀取 session（或建立最小 session，避免頁面空白）
  useEffect(() => {
    if (!isSubject(subject)) {
      setReady(true);
      return;
    }

    const s = getSession(subject);
    const useS = s ?? newSession(subject);

    // 若該科目原本沒有 session，就先寫入，讓「續做」成立
    if (!s) upsertSession(useS);

    setPaused(useS.paused);
    setElapsedSec(useS.elapsedSec);
    setCurrentIndex(useS.currentIndex);
    setTotalQuestions(useS.totalQuestions);
    setCorrectCount(useS.correctCount);
    setWrongCount(useS.wrongCount);
    setHintLimit(useS.hintLimit);
    setHintUsed(useS.hintUsed);

    setReady(true);
  }, [subject]);

  // 2) 計時（暫停時不走）
  useEffect(() => {
    if (!ready) return;
    if (!isSubject(subject)) return;
    if (paused) return;

    const t = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(t);
  }, [ready, paused, subject]);

  // 3) 每次狀態變動就寫回 localStorage（確保「續做」）
  useEffect(() => {
    if (!ready) return;
    if (!isSubject(subject)) return;

    const s = getSession(subject) ?? newSession(subject);
    upsertSession({
      ...s,
      paused,
      elapsedSec,
      currentIndex,
      totalQuestions,
      correctCount,
      wrongCount,
      hintLimit,
      hintUsed
    });
  }, [
    ready,
    subject,
    paused,
    elapsedSec,
    currentIndex,
    totalQuestions,
    correctCount,
    wrongCount,
    hintLimit,
    hintUsed
  ]);

  if (!ready) return null;

  // subject 不合法（避免你误打网址）
  if (!isSubject(subject)) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>作答頁</h1>
        <p style={{ opacity: 0.8, lineHeight: 1.7 }}>
          你沒有指定科目（缺少 subject），請回到學習區從「續做」進入。
        </p>
        <button
          onClick={() => router.replace("/practice")}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid #e0e0e0",
            background: "#fff",
            fontWeight: 900,
            cursor: "pointer",
            marginTop: 12
          }}
        >
          ← 回學習區
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "18px 16px" }}>
      {/* 狀態列：先固定一行，避免你之前「第6題/20」上下跑位 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #e6e6e6",
            background: "#fff",
            fontWeight: 900,
            whiteSpace: "nowrap"
          }}
        >
          科目：{subject}
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #e6e6e6",
            background: "#fff",
            fontWeight: 900,
            whiteSpace: "nowrap"
          }}
        >
          第 {currentIndex + 1} 題 / {totalQuestions}
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #e6e6e6",
            background: "#fff",
            fontWeight: 900,
            whiteSpace: "nowrap"
          }}
        >
          ⏱ {formatTime(elapsedSec)}
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #e6e6e6",
            background: "#fff",
            fontWeight: 900,
            whiteSpace: "nowrap"
          }}
        >
          對：{correctCount} / 錯：{wrongCount}
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #e6e6e6",
            background: "#fff",
            fontWeight: 900,
            whiteSpace: "nowrap"
          }}
        >
          提示：{hintLimit}/{hintUsed}
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #111",
            background: paused ? "#fff" : "#111",
            color: paused ? "#111" : "#fff",
            fontWeight: 900,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {paused ? "▶ 繼續" : "⏸ 暫停"}
        </button>

        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 14px",
            borderRadius: 16,
            border: "1px solid #e0e0e0",
            background: "#fff",
            fontWeight: 900,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          ← 回上一頁
        </button>
      </div>

      {/* 題目區：先給「可調整」的骨架，下一步再放題目與答案規格 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 16,
          padding: 16
        }}
      >
        <h2 style={{ margin: "0 0 8px" }}>題目區（骨架）</h2>
        <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
          下一步會加入：選擇題 / 填空 / 應用題 的作答區規格，以及「提示卡」與「20 題回合結束」。
        </p>
      </div>

      {/* 暫停提示卡：你要求「暫停後才顯示」 */}
      {paused ? (
        <div
          style={{
            marginTop: 12,
            background: "#fff",
            border: "1px solid #111",
            borderRadius: 16,
            padding: 14,
            fontWeight: 900
          }}
        >
          已暫停，請點「繼續」才可作答
        </div>
      ) : null}
    </main>
  );
}