// app/practice/session/page.tsx
import { Suspense } from "react";
import SessionClient from "./SessionClient";

export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>加载中…</div>}>
      <SessionClient />
    </Suspense>
  );
}