import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireActiveProfile, isAuthError } from "@/lib/api/auth-guard";
import { verifyTossPayment } from "@/lib/payment/toss";

const DAY_MS = 24 * 60 * 60 * 1000;

// POST /api/promotion/confirm
// PG(Toss) 콜백 후 호출 — 서버 검증을 통과해야 Promotion을 ACTIVE로 전이하고
// 매물 노출 가중치(promotionTier·promotedUntil)를 세팅한다. 멱등(409).
export async function POST(request: NextRequest) {
  try {
    const auth = await requireActiveProfile();
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { promotionId, pgOrderId, pgPaymentKey } = body;

    if (!promotionId) {
      return NextResponse.json(
        { error: "promotionId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    // 본인 프로모션만 확정 가능
    if (existing.sellerId !== auth.userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (existing.status !== "PENDING") {
      return NextResponse.json(
        { error: "Promotion is not in PENDING state" },
        { status: 409 }
      );
    }

    // 위변조 방지 게이트: 검증 가능 여부를 "클라 입력"이 아니라 "서버 상태(TOSS_SECRET)"로
    // 판단한다(payment/confirm과 동일 정책). set→검증필수, unset→스킵, PG증빙만→fail-closed.
    const hasSecret = Boolean(process.env.TOSS_SECRET);

    if (hasSecret) {
      if (!pgPaymentKey || !pgOrderId) {
        return NextResponse.json(
          { error: "결제 승인 정보가 없습니다." },
          { status: 400 }
        );
      }
      try {
        await verifyTossPayment({
          paymentKey: pgPaymentKey,
          orderId: promotionId,
          amount: existing.amount,
        });
      } catch {
        return NextResponse.json(
          { error: "결제 검증에 실패했습니다." },
          { status: 402 }
        );
      }
    } else if (pgPaymentKey || pgOrderId) {
      return NextResponse.json(
        { error: "결제 검증을 수행할 수 없습니다." },
        { status: 400 }
      );
    }
    // TOSS_SECRET 없음 + PG 증빙 없음 = 개발/테스트 모드: 검증 스킵.

    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + existing.durationDays * DAY_MS);

    const updated = await prisma.$transaction(async (tx) => {
      const promotion = await tx.promotion.update({
        where: { id: promotionId },
        data: {
          status: "ACTIVE",
          paidAt: startsAt,
          startsAt,
          expiresAt,
          ...(pgOrderId && { pgOrderId }),
          ...(pgPaymentKey && { pgPaymentKey }),
        },
      });

      // 노출 가중치 비정규화. 매물이 사라졌어도(0 rows) 결제 확정은 성공으로 둔다.
      await tx.listing.updateMany({
        where: { id: existing.listingId },
        data: { promotionTier: existing.tier, promotedUntil: expiresAt },
      });

      return promotion;
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/promotion/confirm error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
