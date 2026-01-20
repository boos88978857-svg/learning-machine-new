// /lib/session.ts
// ✅ 纯前端 localStorage 版本：支持多科目“做到一半”并可继续/清除
// ✅ 避免 next export/prerender 问题：只在 client 中调用（本文件本身不含 window 访问）

export type Subject = "英语" | "数学" | "其他";

export type QuestionType = "true_false" | "choice" | "application";

export type Choice = { id: string; text: string; correct?: boolean };

export type Question = {
  id: string;
  subject: Subject;
  type: QuestionType;
  prompt: string;
  hint?: string;
  choices?: Choice[]; // true_false / choice 会用
};

export type PracticeSession = {
  id: string;
  subject: Subject;

  // 进度
  currentIndex: number;
  totalQuestions: number;

  // 统计
  correctCount: number;
  wrongCount: number;

  // 提示（你要 3 次：3/1, 3/2, 3/3）
  hintLimit: number; // 固定 3
  hintUsed: number;  // 已用几次

  // 状态
  paused: boolean;
  startedAt: number;     // ms
  elapsedSec: number;    // 计时（秒）
  updatedAt: number;     // ms

  // 题目（先用 mock，之后可替换成题库系统）
  questions: Question[];
};

const LS_KEY = "lm_sessions_v1";
const LS_ACTIVE = "lm_active_session_v1";

function now() {
  return Date.now();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readAll(): Record<string, PracticeSession> {
  if (typeof window === "undefined") return {};
  return safeParse<Record<string, PracticeSession>>(
    window.localStorage.getItem(LS_KEY),
    {}
  );
}

function writeAll(map: Record<string, PracticeSession>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export function listInProgressSessions(): PracticeSession[] {
  const map = readAll();
  const all = Object.values(map);
  // 未完成：currentIndex < totalQuestions
  return all
    .filter((s) => s.currentIndex < s.totalQuestions)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSession(id: string): PracticeSession | null {
  const map = readAll();
  return map[id] ?? null;
}

export function upsertSession(s: PracticeSession) {
  const map = readAll();
  map[s.id] = { ...s, updatedAt: now() };
  writeAll(map);
}

export function removeSession(id: string) {
  const map = readAll();
  delete map[id];
  writeAll(map);

  // 若删的是 active，也清掉
  if (typeof window !== "undefined") {
    const active = window.localStorage.getItem(LS_ACTIVE);
    if (active === id) window.localStorage.removeItem(LS_ACTIVE);
  }
}

export function clearAllSessions() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEY);
  window.localStorage.removeItem(LS_ACTIVE);
}

export function setActiveSessionId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) window.localStorage.removeItem(LS_ACTIVE);
  else window.localStorage.setItem(LS_ACTIVE, id);
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LS_ACTIVE);
}

/** ✅ 先用 mock 题目（之后你接题库系统就替换这里） */
function buildMockQuestions(subject: Subject, total: number): Question[] {
  const base: Question[] = [];

  // 每科至少给三种题型做兼容示范
  base.push({
    id: `${subject}-tf-1`,
    subject,
    type: "true_false",
    prompt: subject === "英语" ? "True/False：'Apple' 是水果。" : "判断题：2+2=4",
    hint: "想想常识或基础计算",
    choices: [
      { id: "T", text: "对", correct: true },
      { id: "F", text: "错", correct: false },
    ],
  });

  base.push({
    id: `${subject}-ch-1`,
    subject,
    type: "choice",
    prompt: subject === "英语" ? "选择题：'book' 中文是？" : "选择题：9÷3=?",
    hint: "排除法",
    choices:
      subject === "英语"
        ? [
            { id: "A", text: "书", correct: true },
            { id: "B", text: "桌子" },
            { id: "C", text: "天空" },
            { id: "D", text: "河流" },
          ]
        : [
            { id: "A", text: "2" },
            { id: "B", text: "3", correct: true },
            { id: "C", text: "4" },
            { id: "D", text: "5" },
          ],
  });

  base.push({
    id: `${subject}-app-1`,
    subject,
    type: "application",
    prompt:
      subject === "英语"
        ? "应用题：用英文写出「我喜欢学习」。"
        : "应用题：小明有 12 颗糖，平均分给 3 个朋友，每人几颗？",
    hint: subject === "英语" ? "I like ..." : "除法 12÷3",
  });

  // 不够就补 choice
  let i = 2;
  while (base.length < total) {
    base.push({
      id: `${subject}-ch-${i}`,
      subject,
      type: "choice",
      prompt: subject === "英语" ? `选择题 ${i}：A,B,C 哪个是字母？` : `选择题 ${i}：${i}+${i}=?`,
      hint: "先想最简单的",
      choices:
        subject === "英语"
          ? [
              { id: "A", text: "A", correct: true },
              { id: "B", text: "苹果" },
              { id: "C", text: "桌子" },
              { id: "D", text: "跑步" },
            ]
          : [
              { id: "A", text: String(i * 2), correct: true },
              { id: "B", text: String(i * 2 + 1) },
              { id: "C", text: String(i * 2 - 1) },
              { id: "D", text: String(i * 2 + 2) },
            ],
    });
    i++;
  }

  return base.slice(0, total);
}

export function newSession(subject: Subject, totalQuestions = 20): PracticeSession {
  const id = `${subject}-${Math.random().toString(36).slice(2, 10)}-${Date.now()
    .toString(36)
    .slice(2, 8)}`;

  const s: PracticeSession = {
    id,
    subject,
    currentIndex: 0,
    totalQuestions,
    correctCount: 0,
    wrongCount: 0,
    hintLimit: 3,
    hintUsed: 0,
    paused: false,
    startedAt: now(),
    elapsedSec: 0,
    updatedAt: now(),
    questions: buildMockQuestions(subject, totalQuestions),
  };

  upsertSession(s);
  setActiveSessionId(id);
  return s;
}