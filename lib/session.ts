// /lib/session.ts
export type Subject = "英文" | "数学" | "其他";

export type SessionStatus = "in_progress" | "done";

export type PracticeSession = {
  id: string;
  subject: Subject;

  // 进度
  currentIndex: number;
  totalQuestions: number;

  // 计时
  startedAt: number; // ms
  elapsedSec: number;

  // 可选：提示（有用就用，不用也不影响）
  hintUsed?: number;
  hintLimit?: number;

  status: SessionStatus;
  updatedAt: number; // ms
};

const KEY_PREFIX = "lm_session_v1:";
const KEY_ACTIVE = "lm_active_session_v1";

function now() {
  return Date.now();
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function keyOf(id: string) {
  return `${KEY_PREFIX}${id}`;
}

export function newSession(subject: Subject, totalQuestions = 20): PracticeSession {
  const id = `${subject}-${now()}-${Math.random().toString(16).slice(2)}`;
  const t = now();
  return {
    id,
    subject,
    currentIndex: 0,
    totalQuestions,
    startedAt: t,
    elapsedSec: 0,
    hintUsed: 0,
    hintLimit: 3,
    status: "in_progress",
    updatedAt: t,
  };
}

/** ✅ 读取单个 session（按 id） */
export function getSession(id: string): PracticeSession | null {
  if (typeof window === "undefined") return null;
  return safeParse<PracticeSession>(localStorage.getItem(keyOf(id)));
}

/** ✅ 写入/更新 session（按 id 覆盖） */
export function upsertSession(s: PracticeSession) {
  if (typeof window === "undefined") return;
  const next: PracticeSession = { ...s, updatedAt: now() };
  localStorage.setItem(keyOf(next.id), JSON.stringify(next));
}

/** ✅ 删除单个 session（按 id） */
export function removeSession(id: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keyOf(id));
  // 如果删掉的是 active，就顺便清掉 active
  const active = getActiveSessionId();
  if (active === id) setActiveSessionId(null);
}

/** ✅ 列出所有 session（包含 done / in_progress） */
export function listAllSessions(): PracticeSession[] {
  if (typeof window === "undefined") return [];
  const out: PracticeSession[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (!k.startsWith(KEY_PREFIX)) continue;
    const s = safeParse<PracticeSession>(localStorage.getItem(k));
    if (s) out.push(s);
  }
  // 新的在前
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}

/** ✅ 只列出“做到一半”的（学习页要用这个） */
export function listInProgressSessions(): PracticeSession[] {
  return listAllSessions().filter((s) => s.status === "in_progress");
}

/** ✅ 清空所有 session（慎用，debug/重置用） */
export function clearAllSessions() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
  setActiveSessionId(null);
}

/** ✅ active session id（用于“继续做”按钮默认跳哪一题） */
export function setActiveSessionId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) localStorage.removeItem(KEY_ACTIVE);
  else localStorage.setItem(KEY_ACTIVE, id);
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_ACTIVE);
}

/** ✅ 兼容旧名字（如果你其他页面之前用过这些名字，保留别炸） */
export function loadSession(id: string) {
  return getSession(id);
}
export function saveSession(s: PracticeSession) {
  return upsertSession(s);
}
export function loadAllSessions() {
  return listAllSessions();
}