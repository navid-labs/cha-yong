import { NextRequest, NextResponse } from "next/server";
import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireActiveProfile, isAuthError } from "@/lib/api/auth-guard";
import { sendBulkNotifications } from "@/lib/notifications/send";
import { verifyTossPayment } from "@/lib/payment/toss";

// POST /api/payment/confirm
// Called after PG (Toss Payments) callback — verify then update escrow status
export async function POST(request: NextRequest) {
  try {
    const auth = await requireActiveProfile();
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { paymentId, pgOrderId, pgPaymentKey } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId is required" }, { status: 400 });
    }

    const existing = await prisma.escrowPayment.findUnique({
      where: { id: paymentId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Only the buyer of this payment may confirm it
    if (existing.buyerId !== auth.userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (existing.status !== "PENDING") {
      return NextResponse.json(
        { error: "Payment is not in PENDING state" },
        { status: 409 }
      );
    }

    // 위변조 방지 게이트: 검증 가능 여부를 "클라 입력(pgPaymentKey 유무)"이 아니라
    // "서버 상태(TOSS_SECRET 존재)"로 판단한다. 그래야 클라가 PG 증빙을 생략해
    // 검증을 우회하는 공격을 막을 수 있다.
    const hasSecret = Boolean(process.env.TOSS_SECRET);

    if (hasSecret) {
      // 운영: Toss 서버 승인 검증을 반드시 통과해야 PAID로 전이한다.
      if (!pgPaymentKey || !pgOrderId) {
        return NextResponse.json(
          { error: "결제 승인 정보가 없습니다." },
          { status: 400 }
        );
      }
      try {
        await verifyTossPayment({
          paymentKey: pgPaymentKey,
          orderId: paymentId,
          amount: existing.totalAmount,
        });
      } catch {
        return NextResponse.json(
          { error: "결제 검증에 실패했습니다." },
          { status: 402 }
        );
      }
    } else if (pgPaymentKey || pgOrderId) {
      // fail-closed: 검증 수단(TOSS_SECRET) 없이 PG 증빙이 들어오면 거절한다.
      return NextResponse.json(
        { error: "결제 검증을 수행할 수 없습니다." },
        { status: 400 }
      );
    }
    // TOSS_SECRET 없음 + PG 증빙 없음 = 개발/테스트 모드: PG 검증 스킵.

    const paidAt = new Date();
    const updated = await prisma.$transaction(async (tx) => {
      const escrow = await tx.escrowPayment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          paidAt,
          ...(pgOrderId && { pgOrderId }),
          ...(pgPaymentKey && { pgPaymentKey }),
        },
      });

      // Conditional transition: ACTIVE → RESERVED only.
      // 0 rows updated (already RESERVED/SOLD) is acceptable — transaction succeeds.
      await tx.listing.updateMany({
        where: { id: existing.listingId, status: "ACTIVE" },
        data: { status: "RESERVED" },
      });

      return escrow;
    });

    await sendBulkNotifications([
      {
        userId: existing.buyerId,
        type: NotificationType.ESCROW_PAID,
        title: "결제가 완료되었습니다",
        message: "명의변경 절차를 진행하세요.",
        linkUrl: `/escrow/${paymentId}`,
      },
      {
        userId: existing.sellerId,
        type: NotificationType.ESCROW_PAID,
        title: "구매 결제가 완료되었습니다",
        message: "명의변경 안내를 확인하세요.",
        linkUrl: `/escrow/${paymentId}`,
      },
    ]);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/payment/confirm error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
