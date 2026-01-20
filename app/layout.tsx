import type { Metadata } from "next";
import Nav from "./nav";
import { ui } from "./ui";

export const metadata: Metadata = {
  title: "Learning Machine",
  description: "Practice app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body style={ui.page}>
        <div style={ui.wrap}>
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}