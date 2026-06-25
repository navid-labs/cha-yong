export const PROMOTION_TIERS = {
  TOP_EXPOSURE: {
    id: "TOP_EXPOSURE",
    name: "목록 상단 노출",
    description: "검색·필터 결과 상단에 우선 표시",
    prices: { 7: 19_900, 30: 49_900 },
  },
  HOME_FEATURED: {
    id: "HOME_FEATURED",
    name: "홈 추천 구좌",
    description: "홈 추천 영역에 매물 강조 노출",
    prices: { 7: 39_900, 30: 99_900 },
  },
} as const;

export type PromotionTierId = keyof typeof PROMOTION_TIERS;
export type PromotionDuration = 7 | 30;

export function getPromotionPrice(
  tierId: PromotionTierId,
  duration: PromotionDuration
): number {
  return PROMOTION_TIERS[tierId].prices[duration];
}

/**
 * 클라이언트가 보낸 tier·기간을 검증하고 서버 기준 금액을 산정한다.
 * 결제 금액은 절대 클라 입력을 믿지 않고 이 함수로만 정한다.
 * 유효하지 않으면 null — 호출부(prepare API)가 400으로 거절한다.
 */
export function resolvePromotionAmount(
  tier: string,
  durationDays: number
): {
  tier: PromotionTierId;
  durationDays: PromotionDuration;
  amount: number;
} | null {
  if (!(tier in PROMOTION_TIERS)) return null;
  if (durationDays !== 7 && durationDays !== 30) return null;
  const tierId = tier as PromotionTierId;
  const duration = durationDays as PromotionDuration;
  return {
    tier: tierId,
    durationDays: duration,
    amount: getPromotionPrice(tierId, duration),
  };
}

export function buildOrderId(listingId: string): string {
  return `PROMO-${listingId}-${Date.now()}`;
}

export function parseListingIdFromOrderId(orderId: string): string | null {
  const match = orderId.match(/^PROMO-(.+)-\d+$/);
  return match?.[1] ?? null;
}
