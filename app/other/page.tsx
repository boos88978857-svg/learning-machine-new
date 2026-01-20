"use client";

import { useRouter } from "next/navigation";

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 16,
  padding: 16
};

const btn: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #e0e0e0",
  background: "#fff",
  fontWeight: 900,
  textDecoration: "none",
  color: "#111",
  cursor: "pointer"
};

export default function OtherPage() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>其他學科</h1>

        <button onClick={() => router.back()} style={btn}>
          ← 回上一頁
        </button>
      </div>

      <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.7 }}>
        這裡是擴充入口（例如自然、社會等）。<br />
        題庫一律自行設計開發，避免觸犯任何版權問題。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 16 }}>
        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>（預留）自然</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            後續新增：單元 → 題型 → 練習回合
          </p>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>（預留）社會</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            後續新增：單元 → 題型 → 練習回合
          </p>
        </div>
      </div>

      <div style={{ marginTop: 18, opacity: 0.65, lineHeight: 1.7 }}>
        後續規劃：
        <br />1) 先建立各學科的「學習內容」與「練習題庫」
        <br />2) 同樣支援「做到一半可續做」與「回合結束統計」
      </div>
    </main>
  );
}