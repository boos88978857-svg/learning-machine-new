export default function PracticePage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 16px"
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>
        學習區
      </h1>

      <p style={{ lineHeight: 1.7, marginBottom: 20 }}>
        這裡是學習入口中心。<br />
        之後會顯示各科目是否有「進行中」的練習，可續做或清除。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {/* 英文 */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 16
          }}
        >
          <h2 style={{ marginTop: 0 }}>英文專區</h2>
          <p style={{ opacity: 0.7 }}>尚未開始練習</p>
        </div>

        {/* 數學 */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 16
          }}
        >
          <h2 style={{ marginTop: 0 }}>數學專區</h2>
          <p style={{ opacity: 0.7 }}>尚未開始練習</p>
        </div>

        {/* 其他 */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 16
          }}
        >
          <h2 style={{ marginTop: 0 }}>其他學科</h2>
          <p style={{ opacity: 0.7 }}>尚未開始練習</p>
        </div>
      </div>

      <p style={{ marginTop: 24, opacity: 0.6 }}>
        下一步將加入：<br />
        ・各科目做到一半的續做狀態<br />
        ・點擊後進入實際作答頁面
      </p>
    </main>
  );
}