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

export default function EnglishPage() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>英文專區</h1>

        <button onClick={() => router.back()} style={btn}>
          ← 回上一頁
        </button>
      </div>

      <p style={{ marginTop: 12, opacity: 0.8, lineHeight: 1.7 }}>
        英文不只出題，也包含學習內容。此頁先把「學習入口」與「練習入口」架好，後續再接課程與題庫（題庫自行研發避免版權）。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 16 }}>
        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>學習</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            內容包含：字彙、文法、聽力、閱讀、口說/跟讀等模組。<br />
            音標需支援兩種（點哪種就播哪種音），並記憶使用者習慣。
          </p>
          <div style={{ marginTop: 14 }}>
            <Link href="/english/learn" style={btnPrimary}>
              進入學習 →
            </Link>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 8px" }}>練習</h2>
          <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.7 }}>
            依等級：A1、A2、B1、B2、C1、C2；另外含 TOEIC 模式。<br />
            後續會提供「階段選擇 → 開始作答」流程（學習區只負責續做）。
          </p>
          <div style={{ marginTop: 14 }}>
            <Link href="/english/practice" style={btnPrimary}>
              進入練習 →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, opacity: 0.65, lineHeight: 1.7 }}>
        下一步我會依你的企劃把流程補齊：
        <br />1) 英文「學習」：課程章節 → 內容頁 → 音標(兩種) + 播放 + 記憶偏好
        <br />2) 英文「練習」：選擇等級 → 產生回合 → 進入作答頁（提示 5 次 / 20 題回合）
      </div>
    </main>
  );
}