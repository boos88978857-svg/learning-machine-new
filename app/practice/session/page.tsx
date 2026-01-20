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