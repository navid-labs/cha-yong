# 프로모션 결제 MVP 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 매물 등록 후 유료 프로모션(상단 노출/홈 추천)을 Toss 테스트 모드로 결제하는 MVP 구현

**Architecture:** 기존 promote 페이지(서버 컴포넌트)를 클라이언트 컴포넌트로 전환하여 티어 선택 + Toss SDK 결제 플로우를 추가. 성공/실패 결과 페이지를 신규 생성. DB 변경 없이 프론트엔드만으로 완결되는 MVP.

**Tech Stack:** Next.js App Router, React 19, @tosspayments/tosspayments-sdk v2, Tailwind CSS 4, 차용 디자인 시스템

---

## 파일 구조

| 파일 | 상태 | 역할 |
|------|------|------|
| `src/lib/promotion/constants.ts` | 신규 | 프로모션 티어/가격 상수 + 타입 |
| `src/features/sell/components/listing-summary-card.tsx` | 신규 | 매물 요약 카드 (썸네일, 제목, 월납입금) |
| `src/features/sell/components/promotion-tier-selector.tsx` | 신규 | 3개 티어 라디오 + 기간 토글 |
| `src/features/sell/components/payment-summary.tsx` | 신규 | 선택 상품/기간/금액 요약 |
| `src/features/sell/components/promote-actions.tsx` | 신규 | 결제하기 + 건너뛰기 버튼 |
| `src/features/sell/components/promote-client.tsx` | 신규 | promote 페이지 클라이언트 메인 컴포넌트 |
| `src/app/(public)/sell/promote/page.tsx` | 수정 | 서버 컴포넌트 → listingId 파싱 + PromoteClient 렌더 |
| `src/app/(public)/sell/promote/success/page.tsx` | 신규 | 결제 성공 결과 페이지 |
| `src/app/(public)/sell/promote/fail/page.tsx` | 신규 | 결제 실패 결과 페이지 |

---

### Task 1: 프로모션 상수 정의

**Files:**
- Create: `src/lib/promotion/constants.ts`

- [ ] **Step 1: 상수 파일 생성**

```ts
// src/lib/promotion/constants.ts
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
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/lib/promotion/constants.ts
git commit -m "feat(promotion): add promotion tier constants and helpers"
```

---

### Task 2: ListingSummaryCard 컴포넌트

**Files:**
- Create: `src/features/sell/components/listing-summary-card.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```tsx
// src/features/sell/components/listing-summary-card.tsx
"use client";

import Image from "next/image";
import { formatKRW } from "@/lib/utils/format";

interface ListingSummaryCardProps {
  title: string;
  thumbnailUrl: string | null;
  monthlyPayment: number;
}

export function ListingSummaryCard({
  title,
  thumbnailUrl,
  monthlyPayment,
}: ListingSummaryCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-4"
      style={{
        backgroundColor: "var(--chayong-surface)",
        border: "1px solid var(--chayong-border)",
      }}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No img
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p
          className="truncate text-sm font-bold"
          style={{ color: "var(--chayong-text)" }}
        >
          {title}
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color: "var(--chayong-primary)" }}
        >
          {formatKRW(monthlyPayment, { monthly: true })}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/sell/components/listing-summary-card.tsx
git commit -m "feat(promotion): add ListingSummaryCard component"
```

---

### Task 3: PromotionTierSelector 컴포넌트

**Files:**
- Create: `src/features/sell/components/promotion-tier-selector.tsx`

- [ ] **Step 1: 컴포넌트 생성**

이 컴포넌트는 3가지 선택지를 렌더링한다: "기본 등록(무료)", "목록 상단 노출", "홈 추천 구좌".
유료 티어 선택 시 기간(7일/30일) 토글이 나타난다.

```tsx
// src/features/sell/components/promotion-tier-selector.tsx
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

            {/* 기간 토글 (선택된 유료 티어에서만 표시) */}
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
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/sell/components/promotion-tier-selector.tsx
git commit -m "feat(promotion): add PromotionTierSelector component"
```

---

### Task 4: PaymentSummary 컴포넌트

**Files:**
- Create: `src/features/sell/components/payment-summary.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```tsx
// src/features/sell/components/payment-summary.tsx
"use client";

import { formatKRW } from "@/lib/utils/format";

interface PaymentSummaryProps {
  tierName: string;
  duration: number;
  amount: number;
}

export function PaymentSummary({
  tierName,
  duration,
  amount,
}: PaymentSummaryProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--chayong-border)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--chayong-divider)" }}
      >
        <span className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          상품
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--chayong-text)" }}
        >
          {tierName}
        </span>
      </div>
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--chayong-divider)" }}
      >
        <span className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          기간
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--chayong-text)" }}
        >
          {duration}일
        </span>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span
          className="text-sm font-bold"
          style={{ color: "var(--chayong-text)" }}
        >
          결제 금액
        </span>
        <span
          className="text-lg font-bold"
          style={{ color: "var(--chayong-primary)" }}
        >
          {formatKRW(amount)}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/sell/components/payment-summary.tsx
git commit -m "feat(promotion): add PaymentSummary component"
```

---

### Task 5: PromoteActions 컴포넌트

**Files:**
- Create: `src/features/sell/components/promote-actions.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```tsx
// src/features/sell/components/promote-actions.tsx
"use client";

import { formatKRW } from "@/lib/utils/format";

interface PromoteActionsProps {
  isPaid: boolean;
  amount: number;
  isLoading: boolean;
  onPay: () => void;
  onSkip: () => void;
}

export function PromoteActions({
  isPaid,
  amount,
  isLoading,
  onPay,
  onSkip,
}: PromoteActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onSkip}
        className="flex-1 rounded-xl py-3.5 text-[15px] font-semibold transition-colors"
        style={{
          backgroundColor: "var(--chayong-surface)",
          color: "var(--chayong-text-sub)",
          border: "1px solid var(--chayong-border)",
        }}
      >
        건너뛰기
      </button>
      {isPaid && (
        <button
          type="button"
          onClick={onPay}
          disabled={isLoading}
          className="flex-[2] rounded-xl py-3.5 text-[15px] font-semibold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: "var(--chayong-primary)" }}
        >
          {isLoading ? "처리 중..." : `결제하기 · ${formatKRW(amount)}`}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/sell/components/promote-actions.tsx
git commit -m "feat(promotion): add PromoteActions component"
```

---

### Task 6: PromoteClient 메인 클라이언트 컴포넌트

**Files:**
- Create: `src/features/sell/components/promote-client.tsx`

- [ ] **Step 1: 컴포넌트 생성**

이 컴포넌트가 전체 promote 페이지의 클라이언트 로직을 관리한다.
매물 정보 fetch, 티어 선택 상태, Toss SDK 로드 및 `requestPayment` 호출을 담당.

```tsx
// src/features/sell/components/promote-client.tsx
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
import {
  PROMOTION_TIERS,
  type PromotionTierId,
  getPromotionPrice,
  buildOrderId,
} from "@/lib/promotion/constants";

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
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TossPayments = (window as any).TossPayments;

      if (!clientKey || !TossPayments) {
        // 테스트 모드: SDK 키 없으면 바로 success 페이지로 이동
        const orderId = buildOrderId(listing.id);
        router.push(
          `/sell/promote/success?orderId=${orderId}&amount=${amount}&orderName=${encodeURIComponent(`${tierName} · ${selection.duration}일`)}`
        );
        return;
      }

      const tossPayments = TossPayments(clientKey);
      const payment = await tossPayments.payment({ customerKey: "ANONYMOUS" });
      const orderId = buildOrderId(listing.id);

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId,
        orderName: `${tierName} · ${selection.duration}일`,
        successUrl: `${window.location.origin}/sell/promote/success`,
        failUrl: `${window.location.origin}/sell/promote/fail`,
      });
    } catch {
      // 사용자 결제창 취소 등
    } finally {
      setPaying(false);
    }
  }, [selection, listing, amount, tierName, router]);

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
          style={{ borderColor: "var(--chayong-border)", borderTopColor: "transparent" }}
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

      {/* 매물 요약 */}
      <ListingSummaryCard
        title={listingTitle}
        thumbnailUrl={thumbnailUrl}
        monthlyPayment={listing.monthlyPayment}
      />

      {/* 티어 선택 */}
      <PromotionTierSelector selection={selection} onSelect={setSelection} />

      {/* 결제 요약 (유료 선택 시만) */}
      {isPaid && (
        <PaymentSummary
          tierName={tierName}
          duration={duration}
          amount={amount}
        />
      )}

      {/* 액션 버튼 */}
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
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/sell/components/promote-client.tsx
git commit -m "feat(promotion): add PromoteClient main component with Toss SDK integration"
```

---

### Task 7: promote 페이지 리디자인

**Files:**
- Modify: `src/app/(public)/sell/promote/page.tsx` (전체 교체)

- [ ] **Step 1: 기존 페이지를 서버 래퍼로 교체**

기존 정적 카드 UI를 제거하고, `PromoteClient`를 렌더하는 서버 컴포넌트로 변경.
인증 체크와 `listingId` 파싱은 서버에서 처리.

```tsx
// src/app/(public)/sell/promote/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/auth";
import { PromoteClient } from "@/features/sell/components/promote-client";

export const metadata: Metadata = {
  title: "프로모션 선택",
  description: "매물 프로모션 옵션을 선택하고 결제하세요.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SellPromotePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [session, params] = await Promise.all([getSession(), searchParams]);
  const listingId =
    typeof params.listingId === "string" ? params.listingId : "";

  if (!session) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/sell/promote?listingId=${listingId}`)}`
    );
  }

  return (
    <div className="bg-[var(--chayong-bg)] px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-lg">
        <PromoteClient listingId={listingId} />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/\(public\)/sell/promote/page.tsx
git commit -m "feat(promotion): redesign promote page with tier selection and payment flow"
```

---

### Task 8: 결제 성공 페이지

**Files:**
- Create: `src/app/(public)/sell/promote/success/page.tsx`

- [ ] **Step 1: 성공 페이지 생성**

```tsx
// src/app/(public)/sell/promote/success/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "프로모션 결제 완료",
  description: "프로모션 결제가 성공적으로 완료되었습니다.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PromoteSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orderName =
    typeof params.orderName === "string"
      ? decodeURIComponent(params.orderName)
      : "프로모션";
  const amount =
    typeof params.amount === "string" ? Number(params.amount) : 0;

  return (
    <div className="bg-[var(--chayong-bg)] px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-lg">
        <div className="flex flex-col items-center rounded-xl border border-[var(--chayong-border)] bg-white p-8 shadow-sm text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <CheckCircle size={40} style={{ color: "var(--chayong-success)" }} />
          </div>

          <h1
            className="mt-6 text-xl font-bold"
            style={{ color: "var(--chayong-text)" }}
          >
            프로모션 결제 완료
          </h1>

          <div
            className="mt-4 w-full rounded-xl p-4"
            style={{
              backgroundColor: "var(--chayong-surface)",
              border: "1px solid var(--chayong-border)",
            }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--chayong-text-sub)" }}>상품</span>
              <span
                className="font-medium"
                style={{ color: "var(--chayong-text)" }}
              >
                {orderName}
              </span>
            </div>
            {amount > 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span style={{ color: "var(--chayong-text-sub)" }}>
                  결제 금액
                </span>
                <span
                  className="font-bold"
                  style={{ color: "var(--chayong-primary)" }}
                >
                  {amount.toLocaleString("ko-KR")}원
                </span>
              </div>
            )}
          </div>

          <p
            className="mt-4 text-sm"
            style={{ color: "var(--chayong-text-sub)" }}
          >
            프로모션이 적용되면 매물이 더 많은 구매자에게 노출됩니다.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <Link
              href="/my/listings"
              className="flex-1 flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors"
              style={{
                backgroundColor: "var(--chayong-primary)",
                color: "white",
              }}
            >
              내 매물 보기
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors"
              style={{
                backgroundColor: "var(--chayong-surface)",
                color: "var(--chayong-text-sub)",
                border: "1px solid var(--chayong-border)",
              }}
            >
              홈으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/\(public\)/sell/promote/success/page.tsx
git commit -m "feat(promotion): add payment success page"
```

---

### Task 9: 결제 실패 페이지

**Files:**
- Create: `src/app/(public)/sell/promote/fail/page.tsx`

- [ ] **Step 1: 실패 페이지 생성**

```tsx
// src/app/(public)/sell/promote/fail/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { parseListingIdFromOrderId } from "@/lib/promotion/constants";

export const metadata: Metadata = {
  title: "프로모션 결제 실패",
  description: "결제 처리 중 문제가 발생했습니다.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PromoteFailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : "";
  const message =
    typeof params.message === "string" ? params.message : "결제가 취소되었습니다.";
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const listingId = parseListingIdFromOrderId(orderId);

  return (
    <div className="bg-[var(--chayong-bg)] px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-lg">
        <div className="flex flex-col items-center rounded-xl border border-[var(--chayong-border)] bg-white p-8 shadow-sm text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <XCircle size={40} style={{ color: "var(--chayong-danger)" }} />
          </div>

          <h1
            className="mt-6 text-xl font-bold"
            style={{ color: "var(--chayong-text)" }}
          >
            결제에 실패했습니다
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--chayong-text-sub)" }}
          >
            {message}
          </p>

          {code && (
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--chayong-text-caption)" }}
            >
              오류 코드: {code}
            </p>
          )}

          <div className="mt-6 flex w-full gap-3">
            {listingId ? (
              <Link
                href={`/sell/promote?listingId=${listingId}`}
                className="flex-1 flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors"
                style={{
                  backgroundColor: "var(--chayong-primary)",
                  color: "white",
                }}
              >
                다시 시도
              </Link>
            ) : null}
            <Link
              href="/my/listings"
              className={`${listingId ? "flex-1" : "w-full"} flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors`}
              style={{
                backgroundColor: "var(--chayong-surface)",
                color: "var(--chayong-text-sub)",
                border: "1px solid var(--chayong-border)",
              }}
            >
              건너뛰기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `bunx tsc --noEmit --pretty 2>&1 | head -20`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/\(public\)/sell/promote/fail/page.tsx
git commit -m "feat(promotion): add payment fail page"
```

---

### Task 10: 통합 검증

**Files:** 없음 (검증만)

- [ ] **Step 1: 전체 타입 체크**

Run: `bunx tsc --noEmit --pretty`
Expected: 에러 없음

- [ ] **Step 2: 린트 체크**

Run: `bun run lint`
Expected: 에러 없음

- [ ] **Step 3: 빌드 체크**

Run: `bun run build 2>&1 | tail -30`
Expected: 빌드 성공. promote, promote/success, promote/fail 라우트가 출력에 표시.

- [ ] **Step 4: 브라우저 수동 검증**

`bun dev`로 개발 서버 실행 후 다음 경로 확인:

1. `/sell/promote?listingId={실제ID}` — 매물 요약 카드, 티어 선택 UI, 기간 토글, 결제 요약, 결제하기/건너뛰기 버튼
2. "기본 등록" 선택 시 — 결제하기 버튼 숨김, 건너뛰기만 표시
3. 유료 티어 선택 시 — 기간 토글(7일/30일) 표시, 금액 변경, 결제 요약 표시
4. "결제하기" 클릭 → Toss 키 없으면 success 페이지로 이동
5. `/sell/promote/success?orderName=...&amount=...` — 결제 완료 UI
6. `/sell/promote/fail?code=TEST&message=테스트실패&orderId=PROMO-abc-123` — 실패 UI + "다시 시도" 링크
7. "건너뛰기" 클릭 → `/my/listings` 이동
