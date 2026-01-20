"use client";

import Link from "next/link";
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

const btnPrimary: React.CSSProperties = {
  ...btn,
  borderColor: "#111",
  background: "#111",
  color: "#fff"
};

export default function MathPage() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>數學專區</h1>

        <button onClick={() => router.back()} style={btn}>
          ← 回上一頁
        </button>
      </div>

      <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.7 }}>
        數學分級：國小（小1~小6）、國中（國1~國3）、高中（高1~高3）。
        <br />
        後續作答頁會搭配「涂鴉牆」與「珠算/珠算盤」工具（必要時可隱藏/呼出），並避免書寫時頁面跟著滑動。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 16 }}>
        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>國小</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>小1 ~ 小6</p>
          <div style={{ marginTop: 14 }}>
            <Link href="/math/elementary" style={btnPrimary}>
              選擇年級 →
            </Link>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>國中</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>國1 ~ 國3</p>
          <div style={{ marginTop: 14 }}>
            <Link href="/math/junior" style={btnPrimary}>
              選擇年級 →
            </Link>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>高中</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>高1 ~ 高3</p>
          <div style={{ marginTop: 14 }}>
            <Link href="/math/senior" style={btnPrimary}>
              選擇年級 →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, opacity: 0.65, lineHeight: 1.7 }}>
        後續規劃：
        <br />1) 先選「階段 / 年級」→ 再選單元 → 產生練習回合
        <br />2) 作答頁固定橫向版面（App / 平板強制橫屏）
        <br />3) 涂鴉牆預設隱藏，點擊後以「半屏」方式展開，不影響題目排版
        <br />4) 珠算盤工具體積大，採「需要時呼出」模式
      </div>
    </main>
  );
}