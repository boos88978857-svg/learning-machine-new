"use client";

import { useSearchParams } from "next/navigation";

export default function SessionClient() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");

  return (
    <div style={{ padding: 20 }}>
      <h1>练习中</h1>
      <p>科目：{subject}</p>
    </div>
  );
}