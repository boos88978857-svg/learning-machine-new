"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSession,
  upsertSession,
  removeSession,
  PracticeSession,
  Question
} from "../../../lib/session";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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

export default function SessionClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const id = useMemo(() => sp.get("id") ?? "", [sp]);

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<PracticeSession | null>(null);

  // UI 状态
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showHint, setShowHint] = useState(false);

  // 载入 session
  useEffect(() => {
    if (!id) {
      setReady(true);
      setSession(null);
      return;
    }

    const s = getSession(id);
    setSession(s);
    setReady(true);
  }, [id]);

  // 计时（暂停/结束都不走）
  useEffect(() => {
    if (!ready) return;
    if (!session) return;
    if (session.paused) return;
    if (session.currentIndex >= session.totalQuestions) return;

    const t = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, elapsedSec: prev.elapsedSec + 1 };
        upsertSession(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [ready, session?.paused, session?.currentIndex, session?.totalQuestions]);

  if (!ready) return null;

  // 没有 id 或找不到 session
  if (!id || !session) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>
          作答頁
        </h1>
        <p style={{ opacity: 0.8, lineHeight: 1.7 }}>
          找不到作答進度，請回到學習區從「繼續」進入。
        </p>
        <button onClick={() => router.replace("/practice")} style={btn}>
          ← 回學習區
        </button>
      </main>
    );
  }

  const finished = session.currentIndex >= session.totalQuestions;

  const q: Question | null = finished
    ? null
    : session.questions[session.currentIndex] ?? null;

  function togglePause() {
    const next = { ...session, paused: !session.paused };
    upsertSession(next);
    setSession(next);

    // 暂停时保持提示卡（你说“保持提醒卡就可以”）
    // 不做弹窗
  }

  function useHint() {
    if (session.paused || locked || finished) return;

    if (session.hintUsed >= session.hintLimit) return;

    const next = { ...session, hintUsed: session.hintUsed + 1 };
    upsertSession(next);
    setSession(next);

    setShowHint(true); // 点开后一直留着，直到答对跳下一题才关
  }

  function pick(choiceId: string) {
    if (session.paused || locked || finished) return;
    setSelected(choiceId);
    // 你要求：不显示“已选取”字样，所以这里只清 message
    setMessage("");
  }

  function submit() {
    if (session.paused || locked || finished) return;

    // ✅ 没选答案不能提交
    if (!selected) {
      setMessage("請先選擇答案");
      return;
    }

    // 判断题型
    if (!q) return;

    // 目前先处理 true_false / choice（有 choices）
    const choices = q.choices ?? [];
    const picked = choices.find((c) => c.id === selected);
    const isCorrect = picked?.correct === true;

    if (isCorrect) {
      const next = {
        ...session,
        correctCount: session.correctCount + 1
      };
      upsertSession(next);
      setSession(next);

      setMessage("答對了！請繼續下一題");
      setLocked(true);

      // ✅ 答對後：延迟一下再进下一题，且自动关提示
      setTimeout(() => {
        const s2 = getSession(id);
        if (!s2) return;

        const after = {
          ...s2,
          currentIndex: s2.currentIndex + 1
        };
        upsertSession(after);
        setSession(after);

        setSelected(null);
        setMessage("");
        setShowHint(false);
        setLocked(false);
      }, 900);
    } else {
      const next = {
        ...session,
        wrongCount: session.wrongCount + 1
      };
      upsertSession(next);
      setSession(next);

      // ✅ 答错文案（不说你选错了）
      setMessage("很可惜答錯了，再試一次");
      // 不跳题，让他继续选
    }
  }

  // 回合结束画面（20 题）
  if (finished) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "18px 16px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 12px" }}>
          回合完成（{session.subject}）
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
            <div style={pill}>總題數：{session.totalQuestions}</div>
            <div style={pill}>對：{session.correctCount}</div>
            <div style={pill}>錯：{session.wrongCount}</div>
            <div style={pill}>⏱ {formatTime(session.elapsedSec)}</div>
            <div style={pill}>
              提示：{session.hintLimit}/{session.hintUsed}
            </div>
          </div>

          <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.7 }}>
            這個回合已結束。後續會把結果寫入「記錄」頁與競技場排行。
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={() => router.replace("/practice")} style={btnPrimary}>
              回學習區
            </button>

            <button
              onClick={() => {
                // 结束后可选择清除这回合
                removeSession(session.id);
                router.replace("/practice");
              }}
              style={btn}
            >
              清除本回合
            </button>

            <button onClick={() => router.back()} style={btn}>
              ← 回上一頁
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "18px 16px" }}>
      {/* 状态列：尽量一行 + 不跑版 */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
        <div style={pill}>科目：{session.subject}</div>
        <div style={pill}>
          第 {session.currentIndex + 1} 題 / {session.totalQuestions}
        </div>
        <div style={pill}>⏱ {formatTime(session.elapsedSec)}</div>

        {/* ✅ 只留对错 */}
        <div style={pill}>
          對：{session.correctCount} / 錯：{session.wrongCount}
        </div>

        {/* ✅ 提示显示：3/1、3/2、3/3 */}
        <button onClick={useHint} style={btn} disabled={session.paused || locked}>
          提示 {session.hintLimit}/{session.hintUsed}
        </button>

        <button onClick={togglePause} style={session.paused ? btn : btnPrimary}>
          {session.paused ? "▶ 繼續" : "⏸ 暫停"}
        </button>

        <button onClick={() => router.back()} style={btn}>
          ← 回上一頁
        </button>
      </div>

      {/* 题目卡 */}
      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 16, padding: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>題目</div>
        <div style={{ lineHeight: 1.7 }}>{q?.prompt}</div>

        {/* 提示卡：点开后保持到答对才消失 */}
        {showHint && q?.hint ? (
          <div style={{ marginTop: 12, borderRadius: 14, border: "1px solid #111", padding: 12, fontWeight: 900 }}>
            提示：{q.hint}
          </div>
        ) : null}

        {/* 信息提示（请先选答案 / 答对 / 很可惜） */}
        {message ? (
          <div style={{ marginTop: 12, borderRadius: 14, border: "1px solid #e0e0e0", padding: 12, fontWeight: 900 }}>
            {message}
          </div>
        ) : null}

        {/* 暂停卡：只在暂停后出现 */}
        {session.paused ? (
          <div style={{ marginTop: 12, borderRadius: 14, border: "1px solid #111", padding: 12, fontWeight: 900 }}>
            已暫停，請點「繼續」才可作答
          </div>
        ) : null}
      </div>

      {/* 答案区：目前先处理有 choices 的题（判断/选择题） */}
      {q?.choices && q.choices.length > 0 ? (
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {q.choices.map((c) => {
            const picked = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => pick(c.id)}
                disabled={session.paused || locked}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: picked ? "1px solid #111" : "1px solid #e0e0e0",
                  background: picked ? "#111" : "#fff",
                  color: picked ? "#fff" : "#111",
                  fontWeight: 900,
                  cursor: session.paused || locked ? "not-allowed" : "pointer"
                }}
              >
                {c.text}
              </button>
            );
          })}
        </div>
      ) : (
        // 应用题/开放题（先占位，后续接输入框 + 涂鸦墙 + 珠算盘）
        <div style={{ marginTop: 12, background: "#fff", border: "1px dashed #ddd", borderRadius: 16, padding: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>作答區（預留）</div>
          <div style={{ opacity: 0.75, lineHeight: 1.7 }}>
            這題是「應用題/開放題」類型，後續會放：
            <br />- 文字輸入 / 算式輸入
            <br />- 涂鴉牆（可隱藏/呼出，半屏，不影響排版）
            <br />- 珠算盤（需要時呼出）
          </div>
        </div>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={submit} style={btnPrimary} disabled={session.paused || locked}>
          送出答案
        </button>
      </div>
    </main>
  );
}