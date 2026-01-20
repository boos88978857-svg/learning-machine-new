export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 16px"
      }}
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 900,
          marginBottom: 24
        }}
      >
        AI 智能學習機
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
          歡迎使用 AI 智能學習機。<br />
          這是一個全新重建的專案骨架，目前僅確認：
        </p>

        <ul style={{ lineHeight: 1.8 }}>
          <li>專案可以正常建置（build）</li>
          <li>首頁可以正常顯示</li>
          <li>後續可逐步加入學習、練習與續做功能</li>
        </ul>

        <p style={{ marginTop: 16, opacity: 0.7 }}>
          下一步將加入「上方導覽列」與其他頁面入口。
        </p>
      </div>
    </main>
  );
}