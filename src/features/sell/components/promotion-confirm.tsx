"use client";

import { useEffect, useRef, useState } from "react";

interface PromotionConfirmProps {
  promotionId: string;
  /** 실제 Toss 콜백에서만 존재. 없으면 테스트 모드로 간주해 PG 증빙을 보내지 않는다. */
  paymentKey?: string;
}

/**
 * 결제 성공 화면 진입 시 서버 confirm을 1회 호출해 프로모션을 활성화한다.
 * - paymentKey 있음(실결제): pgPaymentKey/pgOrderId를 함께 보내 서버 검증을 태운다.
 * - paymentKey 없음(테스트): promotionId만 보낸다 — pg 증빙을 보내면 서버가
 *   fail-closed로 거절하므로 절대 포함하지 않는다.
 * 409(이미 확정)는 멱등 성공으로 처리한다.
 */
export function PromotionConfirm({
  promotionId,
  paymentKey,
}: PromotionConfirmProps) {
  const [failed, setFailed] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!promotionId || fired.current) return;
    fired.current = true;

    const body: Record<string, string> = { promotionId };
    if (paymentKey) {
      body.pgPaymentKey = paymentKey;
      body.pgOrderId = promotionId; // Toss orderId === Promotion.id
    }

    fetch("/api/promotion/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => setFailed(!res.ok && res.status !== 409))
      .catch(() => setFailed(true));
  }, [promotionId, paymentKey]);

  if (!failed) return null;

  return (
    <p className="mt-2 text-xs" style={{ color: "var(--chayong-danger)" }}>
      노출 적용 처리에 실패했습니다. 내 매물에서 상태를 확인해주세요.
    </p>
  );
}
