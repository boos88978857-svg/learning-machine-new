"use client";

import { useRouter } from "next/navigation";
import { ui } from "../ui";

export default function AboutPage() {
  const router = useRouter();
  return (
    <main style={ui.card}>
      <h2 style={ui.cardTitle}>關於</h2>
      <p style={ui.cardDesc}>這是一個可續做、多科目練習的小工具。</p>

      <button onClick={() => router.back()} style={{ ...ui.btn, marginTop: 14 }}>
        ← 回上一頁
      </button>
    </main>
  );
}