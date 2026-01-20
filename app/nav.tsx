"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首頁" },
  { href: "/practice", label: "學習區" },
  { href: "/record", label: "記錄" },
  { href: "/settings", label: "設定" },
  { href: "/about", label: "關於" }
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        padding: 16,
        borderBottom: "1px solid #eaeaea",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            style={{
              padding: "10px 14px",
              borderRadius: 14,
              border: "1px solid #e0e0e0",
              textDecoration: "none",
              fontWeight: 900,
              color: active ? "#ffffff" : "#111111",
              background: active ? "#111111" : "#ffffff"
            }}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}