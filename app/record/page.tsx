export default function RecordPage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 16px"
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>
        記錄
      </h1>

      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: 20,
          border: "1px solid #e5e5e5"
        }}
      >
        <p style={{ lineHeight: 1.7 }}>
          這裡之後會放：
        </p>

        <ul style={{ lineHeight: 1.8 }}>
          <li>各科目進行中回合（可續做 / 可清除）</li>
          <li>完成回合的統計（正確/錯誤、時間、提示使用）</li>
        </ul>

        <p style={{ marginTop: 16, opacity: 0.7 }}>
          目前為骨架頁面，確保導航可正常進出。
        </p>
      </div>
    </main>
  );
}