"use client";

/**
 * AI 智能學習機：本地續做資料（LocalStorage）
 * 目標：同時保存多科目「做到一半」狀態，學習區可續做/清除
 */

export type Subject = "英文" | "數學" | "其他";

export type PracticeSession = {
  id: string;
  subject: Subject;

  // 一回合固定 20 題（先定死，後續可調）
  totalQuestions: number;
  currentIndex: number; // 0-based
  elapsedSec: number;
  paused: boolean;

  correctCount: number;
  wrongCount: number;

  hintLimit: number; // 5
  hintUsed: number; // 0~5

  // 作答狀態（最小版）
  selected?: string; // 目前選的答案（示範用）
  updatedAt: number; // 方便排序
};

const KEY = "ai-intelligent-learning-machine:sessions:v1";

/** 產生 session id（簡單可靠即可） */
function makeId(subject: Subject) {
  return `${subject}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readAll(): Record<string, PracticeSession> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, PracticeSession>;
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, PracticeSession>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

/** 建立新回合（注意：學習區不一定直接提供此入口，後續由科目/階段選擇頁建立） */
export function newSession(subject: Subject): PracticeSession {
  return {
    id: makeId(subject),
    subject,
    totalQuestions: 20,
    currentIndex: 0,
    elapsedSec: 0,
    paused: false,
    correctCount: 0,
    wrongCount: 0,
    hintLimit: 5,
    hintUsed: 0,
    updatedAt: Date.now()
  };
}

/** 取得某科目目前進行中 session（沒有就回 null） */
export function getSession(subject: Subject): PracticeSession | null {
  const all = readAll();
  return all[subject] ?? null;
}

/** 寫入/更新某科目 session（同科目只保留 1 份進行中，最穩） */
export function upsertSession(session: PracticeSession) {
  const all = readAll();
  all[session.subject] = { ...session, updatedAt: Date.now() };
  writeAll(all);
}

/** 清除某科目的進度 */
export function clearSession(subject: Subject) {
  const all = readAll();
  delete all[subject];
  writeAll(all);
}

/** 讀取全部科目進度（學習區列表用） */
export function listSessions(): PracticeSession[] {
  const all = readAll();
  return Object.values(all).sort((a, b) => b.updatedAt - a.updatedAt);
}