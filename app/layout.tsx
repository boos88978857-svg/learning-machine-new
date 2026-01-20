import type { Metadata } from "next";
import Nav from "./nav";

export const metadata: Metadata = {
  title: "AI 智能學習機",
  description: "AI 智能學習機（全新重建骨架）"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans TC', sans-serif",
          background: "#fafafa"
        }}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}