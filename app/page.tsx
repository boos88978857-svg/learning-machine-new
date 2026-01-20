import Link from "next/link";
import { ui } from "./ui";

export default function HomePage() {
  return (
    <main>
      <h1 style={ui.h1}>Learning Machine</h1>

      <div style={ui.card}>
        <h2 style={ui.cardTitle}>開始練習</h2>
        <p style={ui.cardDesc}>先去學習區選科目與階段，再開始做題。</p>

        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
          <Link href="/practice" style={{ ...ui.btn, ...ui.btnPrimary }}>
            前往學習區
          </Link>
        </div>
      </div>
    </main>
  );
}