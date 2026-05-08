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

export function buildOrderId(listingId: string): string {
  return `PROMO-${listingId}-${Date.now()}`;
}

export function parseListingIdFromOrderId(orderId: string): string | null {
  const match = orderId.match(/^PROMO-(.+)-\d+$/);
  return match?.[1] ?? null;
}
