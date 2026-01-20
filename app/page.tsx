import Link from "next/link";

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: 16,
  padding: 18
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: 20,
  fontWeight: 900
};

const descStyle: React.CSSProperties = {
  margin: 0,
  opacity: 0.75,
  lineHeight: 1.7
};

const btnStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: 14,
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  fontWeight: 900,
  textDecoration: "none"
};

export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 18px" }}>
        AI 智能學習機
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        <div style={cardStyle}>
          <h2 style={titleStyle}>英文專區</h2>
          <p style={descStyle}>分級學習 + 練習（A1~C2、TOEIC）</p>
          <Link href="/english" style={btnStyle}>
            進入 →
          </Link>
        </div>

        <div style={cardStyle}>
          <h2 style={titleStyle}>數學專區</h2>
          <p style={descStyle}>國小 / 國中 / 高中 分級練習</p>
          <Link href="/math" style={btnStyle}>
            進入 →
          </Link>
        </div>

        <div style={cardStyle}>
          <h2 style={titleStyle}>其他學科</h2>
          <p style={descStyle}>後續擴充入口（不觸犯版權、題庫自研）</p>
          <Link href="/other" style={btnStyle}>
            進入 →
          </Link>
        </div>

        <div style={cardStyle}>
          <h2 style={titleStyle}>學習競技場</h2>
          <p style={descStyle}>闖關 / 排行 / 成就（後續擴充）</p>
          <Link href="/arena" style={btnStyle}>
            進入 →
          </Link>
        </div>
      </div>
    </main>
  );
}