"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 16px"
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>
        關於 AI 智能學習機
      </h1>

      <p style={{ lineHeight: 1.8, marginBottom: 24 }}>
        本系統以「不中斷學習、可續做」為核心設計，
        提供英文、數學與其他學科的智慧練習體驗。
      </p>

      <button
        onClick={() => router.back()}
        style={{
          padding: "10px 16px",
          borderRadius: 14,
          border: "1px solid #e0e0e0",
          background: "#ffffff",
          fontWeight: 800,
          cursor: "pointer"
        }}
      >
        ← 回上一頁
      </button>
    </main>
  );
}