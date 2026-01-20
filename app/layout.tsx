import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Machine",
  description: "AI 智能學習機"
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
        {children}
      </body>
    </html>
  );
}