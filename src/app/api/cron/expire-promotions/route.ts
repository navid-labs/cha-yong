import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

// GET /api/cron/expire-promotions
// Vercel Cron이 주기 호출. 만료된 프로모션을 EXPIRED로 전이하고 매물 노출 가중치를 비운다.
// 멱등(이미 지난 것만 건드림)이라 중복 호출에 안전. CRON_SECRET 설정 시 Bearer 검증.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const [promotions, listings] = await prisma.$transaction([
    prisma.promotion.updateMany({
      where: { status: "ACTIVE", expiresAt: { lte: now } },
      data: { status: "EXPIRED" },
    }),
    prisma.listing.updateMany({
      where: { promotedUntil: { lte: now } },
      data: { promotedUntil: null, promotionTier: null },
    }),
  ]);

  return NextResponse.json({
    expiredPromotions: promotions.count,
    clearedListings: listings.count,
  });
}
