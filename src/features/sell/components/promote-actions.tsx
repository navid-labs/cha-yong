"use client";

import { formatKRW } from "@/lib/utils/format";

interface PromoteActionsProps {
  isPaid: boolean;
  amount: number;
  isLoading: boolean;
  onPay: () => void;
  onSkip: () => void;
}

export function PromoteActions({
  isPaid,
  amount,
  isLoading,
  onPay,
  onSkip,
}: PromoteActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onSkip}
        className="flex-1 rounded-xl py-3.5 text-[15px] font-semibold transition-colors"
        style={{
          backgroundColor: "var(--chayong-surface)",
          color: "var(--chayong-text-sub)",
          border: "1px solid var(--chayong-border)",
        }}
      >
        건너뛰기
      </button>
      {isPaid && (
        <button
          type="button"
          onClick={onPay}
          disabled={isLoading}
          className="flex-[2] rounded-xl py-3.5 text-[15px] font-semibold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: "var(--chayong-primary)" }}
        >
          {isLoading ? "처리 중..." : `결제하기 · ${formatKRW(amount)}`}
        </button>
      )}
    </div>
  );
}
