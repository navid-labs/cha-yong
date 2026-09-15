"use client";

import {
  PROMOTION_TIERS,
  type PromotionTierId,
  type PromotionDuration,
  getPromotionPrice,
} from "@/lib/promotion/constants";
import { formatKRW } from "@/lib/utils/format";

type TierSelection =
  | { type: "free" }
  | { type: "paid"; tierId: PromotionTierId; duration: PromotionDuration };

interface PromotionTierSelectorProps {
  selection: TierSelection;
  onSelect: (selection: TierSelection) => void;
}

const TIER_ENTRIES = Object.values(PROMOTION_TIERS);

export type { TierSelection };

export function PromotionTierSelector({
  selection,
  onSelect,
}: PromotionTierSelectorProps) {
  const selectedTierId = selection.type === "paid" ? selection.tierId : null;
  const selectedDuration = selection.type === "paid" ? selection.duration : 7;

  return (
    <div className="space-y-3">
      {/* 무료 옵션 */}
      <button
        type="button"
        onClick={() => onSelect({ type: "free" })}
        className="w-full rounded-xl p-4 text-left transition-all"
        style={{
          border:
            selection.type === "free"
              ? "2px solid var(--chayong-primary)"
              : "1px solid var(--chayong-border)",
          backgroundColor:
            selection.type === "free"
              ? "color-mix(in srgb, var(--chayong-primary) 5%, white)"
              : "white",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--chayong-text)" }}
            >
              기본 등록
            </p>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--chayong-text-sub)" }}
            >
              관리자 검수 후 일반 목록에 노출
            </p>
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--chayong-text-caption)" }}
          >
            무료
          </span>
        </div>
      </button>

      {/* 유료 옵션 */}
      {TIER_ENTRIES.map((tier) => {
        const isSelected = selectedTierId === tier.id;
        return (
          <div key={tier.id}>
            <button
              type="button"
              onClick={() =>
                onSelect({
                  type: "paid",
                  tierId: tier.id as PromotionTierId,
                  duration: selectedDuration,
                })
              }
              className="w-full rounded-xl p-4 text-left transition-all"
              style={{
                border: isSelected
                  ? "2px solid var(--chayong-primary)"
                  : "1px solid var(--chayong-border)",
                backgroundColor: isSelected
                  ? "color-mix(in srgb, var(--chayong-primary) 5%, white)"
                  : "white",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--chayong-text)" }}
                  >
                    {tier.name}
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--chayong-text-sub)" }}
                  >
                    {tier.description}
                  </p>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--chayong-primary)" }}
                >
                  {formatKRW(tier.prices[7])}~
                </span>
              </div>
            </button>

            {/* 기간 토글 */}
            {isSelected && (
              <div className="mt-2 flex gap-2 px-1">
                {([7, 30] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      onSelect({
                        type: "paid",
                        tierId: tier.id as PromotionTierId,
                        duration: d,
                      })
                    }
                    className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
                    style={{
                      backgroundColor:
                        selectedDuration === d
                          ? "var(--chayong-primary)"
                          : "var(--chayong-surface)",
                      color:
                        selectedDuration === d
                          ? "white"
                          : "var(--chayong-text-sub)",
                      border:
                        selectedDuration === d
                          ? "1px solid var(--chayong-primary)"
                          : "1px solid var(--chayong-border)",
                    }}
                  >
                    {d}일 · {formatKRW(getPromotionPrice(tier.id as PromotionTierId, d))}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
