"use client";

import { useEffect, useState } from "react";
import { CheckCircle, PlusCircle, MessageCircle } from "lucide-react";

export type LiveEvent = {
  id: string;
  text: string;
  type: "new-listing" | "escrow" | "consultation";
};

const ICONS = {
  "new-listing": PlusCircle,
  escrow: CheckCircle,
  consultation: MessageCircle,
} as const;

interface Props {
  events?: LiveEvent[];
  intervalMs?: number;
}

// 실제 최근 활동만 표시한다. 빈 배열이면 렌더하지 않는다(가짜 활동 표시 금지).
export function LiveActivityFeed({ events = [], intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [events.length, intervalMs]);

  if (events.length === 0) return null;
  const current = events[index];
  const Icon = ICONS[current.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-full border px-4 py-2.5 chayong-shadow-sm"
      style={{
        borderColor: "var(--chayong-border)",
        backgroundColor: "var(--chayong-bg)",
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full chayong-icon-well"
        aria-hidden="true"
      >
        <Icon size={16} />
      </span>
      <p
        key={current.id}
        className="chayong-ticker-item truncate text-sm"
        style={{ color: "var(--chayong-text)" }}
      >
        {current.text}
      </p>
      <span
        className="ml-auto hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold md:inline-block"
        style={{
          backgroundColor: "var(--chayong-success)",
          color: "#FFFFFF",
        }}
      >
        LIVE
      </span>
    </div>
  );
}
