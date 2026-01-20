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