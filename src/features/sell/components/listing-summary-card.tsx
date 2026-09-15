"use client";

import Image from "next/image";
import { formatKRW } from "@/lib/utils/format";

interface ListingSummaryCardProps {
  title: string;
  thumbnailUrl: string | null;
  monthlyPayment: number;
}

export function ListingSummaryCard({
  title,
  thumbnailUrl,
  monthlyPayment,
}: ListingSummaryCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-4"
      style={{
        backgroundColor: "var(--chayong-surface)",
        border: "1px solid var(--chayong-border)",
      }}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No img
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p
          className="truncate text-sm font-bold"
          style={{ color: "var(--chayong-text)" }}
        >
          {title}
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color: "var(--chayong-primary)" }}
        >
          {formatKRW(monthlyPayment, { monthly: true })}
        </p>
      </div>
    </div>
  );
}
