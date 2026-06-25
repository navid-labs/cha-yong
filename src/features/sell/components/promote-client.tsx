"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ListingSummaryCard } from "./listing-summary-card";
import {
  PromotionTierSelector,
  type TierSelection,
} from "./promotion-tier-selector";
import { PaymentSummary } from "./payment-summary";
import { PromoteActions } from "./promote-actions";
import { PROMOTION_TIERS, getPromotionPrice } from "@/lib/promotion/constants";

interface ListingData {
  id: string;
  brand: string | null;
  model: string | null;
  monthlyPayment: number;
  images: { url: string }[];
}

interface PromoteClientProps {
  listingId: string;
}

export function PromoteClient({ listingId }: PromoteClientProps) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selection, setSelection] = useState<TierSelection>({ type: "free" });

  useEffect(() => {
    if (!listingId) return;
    fetch(`/api/listings/${listingId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: ListingData) => setListing(data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [listingId]);

  const isPaid = selection.type === "paid";
  const amount =
    selection.type === "paid"
      ? getPromotionPrice(selection.tierId, selection.duration)
      : 0;
  const tierName =
    selection.type === "paid"
      ? PROMOTION_TIERS[selection.tierId].name
      : "기본 등록";
  const duration = selection.type === "paid" ? selection.duration : 0;

  const handlePay = useCallback(async () => {
    if (selection.type !== "paid" || !listing) return;
    setPaying(true);

    try {
      // 서버가 금액을 산정하고 Promotion(PENDING)을 만든다. 그 id가 PG 주문번호.
      const prepareRes = await fetch("/api/promotion/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          tier: selection.tierId,
          durationDays: selection.duration,
        }),
      });

      if (!prepareRes.ok) {
        router.push(
          `/sell/promote/fail?message=${encodeURIComponent("결제 준비에 실패했습니다.")}`
        );
        return;
      }

      const { id: orderId, amount: serverAmount } = await prepareRes.json();
      const orderName = `${tierName} · ${selection.duration}일`;

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TossPayments = (window as any).TossPayments;

      if (!clientKey || !TossPayments) {
        // 테스트 모드: SDK/키 없으면 바로 success로 — 서버 confirm이 검증을 스킵하고 활성화.
        router.push(
          `/sell/promote/success?orderId=${orderId}&amount=${serverAmount}&orderName=${encodeURIComponent(orderName)}`
        );
        return;
      }

      const tossPayments = TossPayments(clientKey);
      const payment = await tossPayments.payment({ customerKey: "ANONYMOUS" });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: serverAmount },
        orderId,
        orderName,
        successUrl: `${window.location.origin}/sell/promote/success`,
        failUrl: `${window.location.origin}/sell/promote/fail`,
      });
    } catch {
      // 사용자 결제창 취소 등
    } finally {
      setPaying(false);
    }
  }, [selection, listing, tierName, router]);

  // Toss SDK 스크립트 로드
  useEffect(() => {
    if (selection.type !== "paid") return;

    const existing = document.getElementById("toss-sdk");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "toss-sdk";
    script.src = "https://js.tosspayments.com/v2/standard";
    document.head.appendChild(script);
  }, [selection.type]);

  const handleSkip = () => router.push("/my/listings");

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{
            borderColor: "var(--chayong-border)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: "var(--chayong-text-sub)" }}>
          매물 정보를 불러올 수 없습니다.
        </p>
        <button
          type="button"
          onClick={() => router.push("/my/listings")}
          className="mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold"
          style={{
            backgroundColor: "var(--chayong-surface)",
            color: "var(--chayong-text)",
            border: "1px solid var(--chayong-border)",
          }}
        >
          내 매물로 이동
        </button>
      </div>
    );
  }

  const listingTitle =
    [listing.brand, listing.model].filter(Boolean).join(" ") || "내 매물";
  const thumbnailUrl = listing.images?.[0]?.url ?? null;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--chayong-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--chayong-primary)]">
          <CheckCircle2 size={14} aria-hidden="true" />
          등록 접수 완료
        </div>
        <h1
          className="text-xl font-bold sm:text-2xl"
          style={{ color: "var(--chayong-text)" }}
        >
          프로모션으로 더 빠르게 팔아보세요
        </h1>
        <p className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          유료 프로모션은 선택 사항이며, 기본 등록만으로도 매물이 노출됩니다.
        </p>
      </div>

      <ListingSummaryCard
        title={listingTitle}
        thumbnailUrl={thumbnailUrl}
        monthlyPayment={listing.monthlyPayment}
      />

      <PromotionTierSelector selection={selection} onSelect={setSelection} />

      {isPaid && (
        <PaymentSummary
          tierName={tierName}
          duration={duration}
          amount={amount}
        />
      )}

      <PromoteActions
        isPaid={isPaid}
        amount={amount}
        isLoading={paying}
        onPay={handlePay}
        onSkip={handleSkip}
      />
    </div>
  );
}
