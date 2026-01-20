"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSession,
  newSession,
  Subject,
  upsertSession
} from "../../../lib/session";

/** ===== 基础工具 ===== */

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function isSubject(v: string): v is Subject {
  return v === "英文" || v === "數學" || v === "其他";
}

/** ===== 假题目结构（示范用，后续换成自研题库） ===== */
type ChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  options: string[];
  answer: number;
  hint: string;
};

/** 暂时用固定 20 题 */
const mockQuestions: ChoiceQuestion[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: `q-${i + 1}`,
    type: "choice",
    prompt: `示範題目 ${i + 1}：以下哪一個是正確答案？`,
    options: ["選項 A", "選項 B", "選項 C", "選項 D"],
    answer: i % 4,
    hint: "這是一個提示示範"
  })
);

export default function PracticeSessionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const subjectRaw = useMemo(() => {
    const raw = sp.get("subject") ?? "";
    return decodeURIComponent(raw);
  }, [sp]);

  const subject: Subject | null = isSubject(subjectRaw) ? subjectRaw : null;

  // ===== 续做资料（从 session 读写）=====
  const [ready, setReady] = useState(false);

  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(20);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 提示：一回合 5 次
  const [hintLimit] = useState(5);
  const [hintUsed, setHintUsed] = useState(0);

  // 作答控制
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false); // 锁住：用于「答对后延迟跳题」
  const [message, setMessage] = useState<string>(""); // 答题提示文案（答对/很可惜）
  const [showHint, setShowHint] = useState(false);

  // 回合结束
  const [finished, setFinished] = useState(false);

  // 当前题
  const q = mockQuestions[currentIndex];

  /** 载入续做资料（没有就建立一份） */
  useEffect(() => {
    if (!subject) {
      setReady(true);
      return;
    }

    const existing = getSession(subject);
    const s = existing ?? newSession(subject);

    if (!existing) upsertSession(s);

    setPaused(s.paused);
    setElapsedSec(s.elapsedSec);
    setCurrentIndex(s.currentIndex);
    setTotalQuestions(s.totalQuestions);

    setCorrectCount(s.correctCount);
    setWrongCount(s.wrongCount);

    setHintUsed(s.hintUsed);

    setReady(true);
  }, [subject]);

  /** 计时：暂停时不走 */
  useEffect(() => {
    if (!ready) return;
    if (!subject) return;
    if (paused) return;
    if (finished) return;

    const t = setInterval(() => setElapsedSec((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [ready, paused, subject, finished]);

  /** 每次关键状态变动就写回 localStorage，确保「续做」 */
  useEffect(() => {
    if (!ready) return;
    if (!subject) return;

    const base = getSession(subject) ?? newSession(subject);

    upsertSession({
      ...base,
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

  /** 当题号到 20 题就结束回合 */
  useEffect(() => {
    if (!ready) return;
    if (currentIndex >= totalQuestions) {
      setFinished(true);
    }
  }, [ready, currentIndex, totalQuestions]);

  if (!ready) return null;

  // subject 不合法：回学習區
  if (!subject) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>作答頁</h1>
        <p style={{ opacity: 0.8, lineHeight: 1.7 }}>
          缺少科目參數，請回到學習區從「繼續」進入。
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

  function togglePause() {
    setPaused((p) => !p);
  }

  function pick(idx: number) {
    if (paused || finished || locked) return;
    setSelectedIndex(idx);
    setMessage(""); // 选答案时不显示「已选取」等文字（你要求拿掉）
  }

  function useHint() {
    if (paused || finished || locked) return;

    // 已用满就不再扣也不再显示
    if (hintUsed >= hintLimit) return;

    setHintUsed((u) => u + 1);
    setShowHint(true); // 提示卡打开后保持，直到答对进入下一题才自动消失
  }

  function goNext() {
    if (paused || finished || locked) return;

    // ✅ 没选答案不能下一题
    if (selectedIndex === null) {
      setMessage("請先選擇答案");
      return;
    }

    // 判题
    const correct = selectedIndex === q.answer;

    if (correct) {
      setCorrectCount((c) => c + 1);
      setMessage("答對了！請繼續下一題");
      setLocked(true);

      // 答对：延迟一下再跳下一题（不要太快）
      setTimeout(() => {
        setSelectedIndex(null);
        setMessage("");
        setShowHint(false); // ✅ 答對後才自動收起提示卡
        setLocked(false);
        setCurrentIndex((i) => i + 1);
      }, 900);
    } else {
      setWrongCount((w) => w + 1);
      setMessage("很可惜答錯了，再試一次"); // ✅ 不说你选错了
      // 答错：不跳题，让他再选；也不自动关提示
    }
  }

  const pill: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 16,
    border: "1px solid #e6e6e6",
    background: "#fff",
    fontWeight: 900,
    whiteSpace: "nowrap"
  };

  const btn: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 16,
    border: "1px solid #e0e0e0",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap"
  };

  const btnPrimary: React.CSSProperties = {
    ...btn,
    borderColor: "#111",
    background: "#111",
    color: "#fff"
  };

  // ===== 回合结束画面（20题）=====
  if (finished) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "18px 16px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 12px" }}>
          回合完成（{subject}）
        </h1>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 16
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={pill}>總題數：{totalQuestions}</div>
            <div style={pill}>對：{correctCount}</div>
            <div style={pill}>錯：{wrongCount}</div>
            <div style={pill}>⏱ {formatTime(elapsedSec)}</div>
            <div style={pill}>
              提示：{hintLimit}/{hintUsed}
            </div>
          </div>

          <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.7 }}>
            下一步我們會把完成回合寫入「記錄」頁，並可在競技場做排行榜。
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={() => router.replace("/practice")} style={btnPrimary}>
              回學習區
            </button>
            <button onClick={() => router.back()} style={btn}>
              ← 回上一頁
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ===== 正常作答画面 =====
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "18px 16px" }}>
      {/* 状态列：固定一行，避免跑版 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <div style={pill}>科目：{subject}</div>
        <div style={pill}>
          第 {currentIndex + 1} 題 / {totalQuestions}
        </div>
        <div style={pill}>⏱ {formatTime(elapsedSec)}</div>

        {/* ✅ 只留对错（你说右侧提示位置多余） */}
        <div style={pill}>
          對：{correctCount} / 錯：{wrongCount}
        </div>

        {/* ✅ 提示显示「5/1」这种：5 = 上限，1 = 已用 */}
        <button onClick={useHint} style={btn} disabled={paused || locked}>
          提示 {hintLimit}/{hintUsed}
        </button>

        <button onClick={togglePause} style={paused ? btn : btnPrimary}>
          {paused ? "▶ 繼續" : "⏸ 暫停"}
        </button>

        <button onClick={() => router.back()} style={btn}>
          ← 回上一頁
        </button>
      </div>

      {/* 题目卡：尽量上移，减少滚动 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 16,
          padding: 14
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 8 }}>題目</div>
        <div style={{ lineHeight: 1.7 }}>{q.prompt}</div>

        {/* 提示卡：点开后保持，直到答对跳下一题才会消失 */}
        {showHint ? (
          <div
            style={{
              marginTop: 12,
              borderRadius: 14,
              border: "1px solid #111",
              padding: 12,
              fontWeight: 900,
              background: "#fff"
            }}
          >
            提示：{q.hint}
          </div>
        ) : null}

        {/* 信息提示（请先选择答案 / 答对 / 很可惜） */}
        {message ? (
          <div
            style={{
              marginTop: 12,
              borderRadius: 14,
              border: "1px solid #e0e0e0",
              padding: 12,
              background: "#fff",
              fontWeight: 900
            }}
          >
            {message}
          </div>
        ) : null}

        {/* 暂停卡：只在暂停后出现 */}
        {paused ? (
          <div
            style={{
              marginTop: 12,
              borderRadius: 14,
              border: "1px solid #111",
              padding: 12,
              background: "#fff",
              fontWeight: 900
            }}
          >
            已暫停，請點「繼續」才可作答
          </div>
        ) : null}
      </div>

      {/* 答案区：选择题示范；点答案只变色，不显示「已选取」 */}
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {q.options.map((opt, idx) => {
          const picked = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={paused || locked}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 14,
                border: picked ? "1px solid #111" : "1px solid #e0e0e0",
                background: picked ? "#111" : "#fff",
                color: picked ? "#fff" : "#111",
                fontWeight: 900,
                cursor: paused || locked ? "not-allowed" : "pointer"
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={goNext} style={btnPrimary} disabled={paused || locked}>
          送出答案
        </button>
      </div>
    </main>
  );
}