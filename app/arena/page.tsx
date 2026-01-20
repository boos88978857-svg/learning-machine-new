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
  color: "#111",
  cursor: "pointer"
};

export default function ArenaPage() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap"
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
          學習競技場
        </h1>

        <button onClick={() => router.back()} style={btn}>
          ← 回上一頁
        </button>
      </div>

      <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.7 }}>
        學習競技場是「進階模式」，用來提升學習動機與挑戰性。
        <br />
        此頁先建立入口骨架，後續再加入對戰、闖關與排行榜。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 16
        }}
      >
        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>闖關模式（預留）</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            依關卡逐步提升難度，答對才能前進。
          </p>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>排行榜（預留）</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            顯示各模式的最佳成績與排名。
          </p>
        </div>
      </div>

      <div style={{ marginTop: 18, opacity: 0.65, lineHeight: 1.7 }}>
        後續規劃：
        <br />1) 競技場會基於「自研題庫」生成挑戰內容
        <br />2) 成績會寫入「記錄」頁，並支援成就與排行
      </div>
    </main>
  );
}