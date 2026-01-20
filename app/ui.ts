import type { CSSProperties } from "react";

export const ui: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#fafafa" },
  wrap: { maxWidth: 960, margin: "0 auto", padding: "16px 16px 40px" },

  navBar: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 },
  navBtn: {
    padding: "10px 16px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    cursor: "pointer"
  },
  navBtnActive: { background: "#111", color: "#fff", borderColor: "#111" },

  h1: { fontSize: 40, margin: "6px 0 14px", fontWeight: 900 },
  card: {
    background: "#fff",
    border: "1.5px solid #e6e6e6",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 1px 0 rgba(0,0,0,0.03)"
  },
  cardTitle: { fontSize: 22, fontWeight: 900, margin: 0 },
  cardDesc: { margin: "8px 0 0", color: "#555", lineHeight: 1.6 },

  btn: {
    padding: "12px 16px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer"
  },
  btnPrimary: { background: "#111", color: "#fff", borderColor: "#111" },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },

  smallLink: { fontSize: 14, color: "#555", textDecoration: "underline", cursor: "pointer" },
  backLink: { fontSize: 14, color: "#555", textDecoration: "underline", cursor: "pointer" }
};