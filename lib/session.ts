// lib/session.ts
// ✅ 全站唯一 Session 数据源（localStorage）
// ✅ 所有页面只能从这里 import

export type Subject = "math" | "english" | "other";

export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  title: string;
  choices?: Choice[];
  answer?: string;
};

export type PracticeSession = {
  id: string;
  subject: Subject;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  hintUsed: number;
  hintLimit: number;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "__learning_machine_sessions__";
const ACTIVE_KEY = "__learning_machine_active_session__";

/* ================= 基础工具 ================= */

function readAll(): PracticeSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(list: PracticeSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ================= 核心 API（必须 export） ================= */

/** 建立新回合 */
export function newSession(subject: Subject, questions: Question[]): PracticeSession {
  const now = Date.now();
  const s: PracticeSession = {
    id: `${subject}-${now}`,
    subject,
    questions,
    currentIndex: 0,
    answers: {},
    hintUsed: 0,
    hintLimit: 3,
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  const all = readAll();
  all.push(s);
  writeAll(all);
  setActiveSessionId(s.id);
  return s;
}

/** 读取单一 session */
export function getSession(id: string): PracticeSession | null {
  return readAll().find(s => s.id === id) ?? null;
}

/** 更新 / 写回 session */
export function upsertSession(session: PracticeSession) {
  const all = readAll();
  const idx = all.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    all[idx] = { ...session, updatedAt: Date.now() };
  } else {
    all.push(session);
  }
  writeAll(all);
}

/** 删除单一 session */
export function removeSession(id: string) {
  writeAll(readAll().filter(s => s.id !== id));
}

/** 清空全部 session（debug 用） */
export function clearAllSessions() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVE_KEY);
}

/** 列出所有未完成 session */
export function listInProgressSessions(): PracticeSession[] {
  return readAll().filter(s => !s.completed);
}

/** 设置当前进行中的 session */
export function setActiveSessionId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_KEY, id);
}

/** 取得当前进行中的 session id */
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}