import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireActiveProfile, isAuthError } from "@/lib/api/auth-guard";
import { resolvePromotionAmount } from "@/lib/promotion/constants";

// POST /api/promotion/prepare
// 매물 소유 판매자가 프로모션 결제를 시작한다. 금액은 클라 입력이 아니라
// 서버가 tier+기간으로 산정하고, Promotion(PENDING)을 만들어 그 id를 PG 주문번호로 쓴다.
export async function POST(request: NextRequest) {
  try {
    const auth = await requireActiveProfile();
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { listingId, tier, durationDays } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    const resolved = resolvePromotionAmount(tier, durationDays);
    if (!resolved) {
      return NextResponse.json(
        { error: "유효하지 않은 프로모션 상품입니다." },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // 본인 매물만 프로모션 가능 — sellerId는 항상 세션에서 추출(body 무시).
    if (listing.sellerId !== auth.userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        listingId,
        sellerId: auth.userId,
        tier: resolved.tier,
        durationDays: resolved.durationDays,
        amount: resolved.amount,
        status: "PENDING",
      },
    });

    // Promotion.id == Toss orderId (escrow가 paymentId를 orderId로 쓰는 것과 동일).
    return NextResponse.json(
      { id: promotion.id, orderId: promotion.id, amount: promotion.amount },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/promotion/prepare error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
