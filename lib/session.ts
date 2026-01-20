// lib/session.ts

export type Subject = "英文" | "数学" | "其他";

export interface PracticeSession {
  id: string;
  subject: Subject;
  currentIndex: number;
  total: number;
  createdAt: number;
}

const STORAGE_KEY = "learning_machine_sessions";

/* ===== 内部工具 ===== */

function readAll(): PracticeSession[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAll(list: PracticeSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ===== 对外 API（你页面用的） ===== */

export function newSession(subject: Subject): PracticeSession {
  return {
    id: crypto.randomUUID(),
    subject,
    currentIndex: 0,
    total: 10,
    createdAt: Date.now(),
  };
}

export function upsertSession(session: PracticeSession) {
  const all = readAll();
  const idx = all.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    all[idx] = session;
  } else {
    all.push(session);
  }
  writeAll(all);
}

export function getSession(id: string): PracticeSession | undefined {
  return readAll().find(s => s.id === id);
}

export function listInProgressSessions(): PracticeSession[] {
  return readAll();
}

export function clearAllSessions() {
  writeAll([]);
}