import { NextRequest, NextResponse } from "next/server";
import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { sendBulkNotifications } from "@/lib/notifications/send";

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

  // 만료 전이 전에 대상 판매자를 모아 알림을 보낸다(updateMany는 행을 못 돌려줌).
  const expiring = await prisma.promotion.findMany({
    where: { status: "ACTIVE", expiresAt: { lte: now } },
    select: { sellerId: true },
  });

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

  // 알림은 비치명적 — 실패해도 만료 처리는 유지.
  if (expiring.length > 0) {
    try {
      await sendBulkNotifications(
        expiring.map((p) => ({
          userId: p.sellerId,
          type: NotificationType.PROMOTION_EXPIRED,
          title: "프로모션이 종료되었습니다",
          message: "다시 노출하려면 매물에서 프로모션을 신청하세요.",
          linkUrl: "/my/listings",
        }))
      );
    } catch (notifyError) {
      console.error("promotion expiry notify failed:", notifyError);
    }
  }

  return NextResponse.json({
    expiredPromotions: promotions.count,
    clearedListings: listings.count,
  });
}
