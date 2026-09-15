# 프로모션 결제 MVP 디자인

> 매물 등록 후 유료 프로모션(상단 노출 / 홈 추천)을 Toss 테스트 모드로 결제하는 MVP 목업

## 범위

- **포함**: promote 페이지 UI 리디자인, Toss 테스트 결제 플로우, 성공/실패 결과 페이지
- **제외**: DB 스키마 변경, 실제 결제 검증(`confirmPayment`), 홈/목록 노출 로직 반영

## 프로모션 상품

| 티어 | 설명 | 7일 | 30일 |
|------|------|-----|------|
| 목록 상단 노출 | 검색·필터 결과 상단에 우선 표시 | 19,900원 | 49,900원 |
| 홈 추천 구좌 | 홈 추천 영역에 매물 강조 노출 | 39,900원 | 99,900원 |

무료 기본 등록은 항상 선택 가능(기본값).

## 사용자 플로우

```
매물 등록 완료
    ↓
/sell/promote?listingId=xxx
    ↓
promote 페이지
  - 매물 요약 카드 (썸네일, 제목, 월납입금)
  - 티어 선택 (라디오: 기본/상단노출/홈추천)
  - 유료 티어 선택 시 → 기간 선택 (7일/30일 토글)
  - 결제 요약 (상품명 + 금액)
  - [결제하기 · 금액]  [건너뛰기]
    ↓
[결제하기] → Toss requestPayment()
  - method: "CARD"
  - orderId: "PROMO-{listingId}-{timestamp}"
  - orderName: "{티어명} · {기간}일"
  - amount: 선택 금액
  - successUrl: /sell/promote/success
  - failUrl: /sell/promote/fail
    ↓
Toss 테스트 결제 팝업
    ↓
성공 → /sell/promote/success?paymentKey=...&orderId=...&amount=...
실패 → /sell/promote/fail?code=...&message=...

[건너뛰기] → /my/listings (마이페이지 매물 목록)
```

## 페이지 구조

### promote 페이지 (`/sell/promote/page.tsx`) — 기존 파일 리디자인

1. `listingId` query param으로 매물 정보 fetch
2. 티어 선택 UI (라디오 그룹)
3. 기간 선택 UI (유료 티어 선택 시만 노출)
4. 결제 요약 (유료 선택 시만 노출)
5. Toss SDK 로드 → 결제하기 버튼으로 `requestPayment()` 호출

### 성공 페이지 (`/sell/promote/success/page.tsx`) — 신규

- query param에서 `paymentKey`, `orderId`, `amount` 읽기
- 결제 완료 UI 표시 (상품명, 금액)
- 서버 검증 스킵 (MVP): `confirmPayment` API 호출하지 않음
- CTA: [내 매물 보기] → `/my/listings`, [홈으로] → `/`

### 실패 페이지 (`/sell/promote/fail/page.tsx`) — 신규

- query param에서 `code`, `message` 읽기
- 실패/취소 UI 표시
- `listingId`는 `orderId`(`PROMO-{listingId}-{timestamp}`)에서 파싱
- CTA: [다시 시도] → `/sell/promote?listingId={파싱된 id}`, [건너뛰기] → `/my/listings`

## 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| `ListingSummaryCard` | `features/sell/components/listing-summary-card.tsx` | 매물 썸네일+제목+월납입금 요약 |
| `PromotionTierSelector` | `features/sell/components/promotion-tier-selector.tsx` | 3개 티어 라디오 + 기간 토글 |
| `PaymentSummary` | `features/sell/components/payment-summary.tsx` | 선택 상품/기간/금액 요약 |
| `PromoteActions` | `features/sell/components/promote-actions.tsx` | 결제하기(금액 표시) + 건너뛰기 버튼 |

## 상수 정의

`src/lib/promotion/constants.ts`:

```ts
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
```

## Toss 연동

- 기존 `EscrowCheckout` 컴포넌트의 Toss SDK 로딩 패턴(`@tosspayments/tosspayments-sdk`) 재활용
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경변수 공유 (테스트 키)
- `orderId` 접두사 `PROMO-`로 에스크로(`ESC-`)와 구분
- MVP에서는 서버 측 `confirmPayment` 호출 없이 success 페이지 UI만 표시

## 디자인 시스템

- 차용 디자인 시스템 준수: `var(--chayong-primary)` (#3182F6), Pretendard 폰트
- 카드형 UI + `shadow-sm` + `hover:shadow-lg`
- 버튼: `h-12`, `rounded-xl`, `font-semibold`, `text-[15px]`
- 선택된 티어: primary 색상 테두리 + 배경 하이라이트
- 금액 표시: `formatKRW` 유틸 사용

## 변경하지 않는 것

- Prisma 스키마 — 프로모션 모델 추가 없음
- 기존 에스크로 결제 코드 — 별도 유지
- 홈/목록 페이지 정렬 로직 — 프로모션 반영 없음
- API 라우트 — 프로모션 결제 확인 API 없음 (MVP)

## 향후 확장 (이번에 구현하지 않음)

- `ListingPromotion` DB 모델 추가 (tierId, duration, startAt, expiresAt, paymentKey)
- 서버 측 `confirmPayment` API로 실제 결제 검증
- 홈/목록 쿼리에서 활성 프로모션 기준 정렬
- 마이페이지에서 프로모션 현황 표시
- 프로모션 만료 알림
