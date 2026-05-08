"use client";

import { formatKRW } from "@/lib/utils/format";

interface PaymentSummaryProps {
  tierName: string;
  duration: number;
  amount: number;
}

export function PaymentSummary({
  tierName,
  duration,
  amount,
}: PaymentSummaryProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--chayong-border)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--chayong-divider)" }}
      >
        <span className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          상품
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--chayong-text)" }}
        >
          {tierName}
        </span>
      </div>
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--chayong-divider)" }}
      >
        <span className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          기간
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--chayong-text)" }}
        >
          {duration}일
        </span>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span
          className="text-sm font-bold"
          style={{ color: "var(--chayong-text)" }}
        >
          결제 금액
        </span>
        <span
          className="text-lg font-bold"
          style={{ color: "var(--chayong-primary)" }}
        >
          {formatKRW(amount)}
        </span>
      </div>
    </div>
  );
}
