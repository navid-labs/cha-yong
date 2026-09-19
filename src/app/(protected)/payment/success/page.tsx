"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

type Phase = "processing" | "success" | "error";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();

  // Toss는 결제 성공 시 successUrl로 paymentKey·orderId·amount를 GET 쿼리로 붙여 리다이렉트한다.
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const missingParams = !orderId || !paymentKey;

  const [phase, setPhase] = useState<Phase>(
    missingParams ? "error" : "processing"
  );
  const [message, setMessage] = useState<string>(
    missingParams ? "결제 정보를 확인할 수 없습니다." : ""
  );

  useEffect(() => {
    if (missingParams) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 금액은 서버가 자체 기록(totalAmount)으로 검증하므로 클라 값은 보내지 않는다.
          body: JSON.stringify({
            paymentId: orderId,
            pgPaymentKey: paymentKey,
            pgOrderId: orderId,
          }),
        });

        if (cancelled) return;

        // 200(정상) 또는 409(이미 처리됨)는 모두 성공으로 간주한다(새로고침·중복 콜백 멱등 처리).
        if (res.ok || res.status === 409) {
          setPhase("success");
          return;
        }

        const body = await res.json().catch(() => ({}));
        setPhase("error");
        setMessage(
          typeof body.error === "string" ? body.error : "결제 확인에 실패했습니다."
        );
      } catch {
        if (!cancelled) {
          setPhase("error");
          setMessage("결제 확인 중 오류가 발생했습니다.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [missingParams, orderId, paymentKey]);

  if (phase === "processing") {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <Loader2
          size={40}
          className="animate-spin"
          style={{ color: "var(--chayong-primary)" }}
        />
        <p className="mt-4 text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          결제를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "#FEF2F2" }}
        >
          <XCircle size={40} style={{ color: "var(--chayong-danger)" }} />
        </div>
        <h1 className="mt-6 text-xl font-bold" style={{ color: "var(--chayong-text)" }}>
          결제 확인에 실패했습니다
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--chayong-text-sub)" }}>
          {message}
        </p>
        <Link
          href="/"
          className="mt-6 flex h-12 items-center justify-center rounded-xl px-6 text-[15px] font-semibold"
          style={{
            backgroundColor: "var(--chayong-surface)",
            color: "var(--chayong-text-sub)",
            border: "1px solid var(--chayong-border)",
          }}
        >
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: "#F0FDF4" }}
      >
        <CheckCircle size={40} style={{ color: "var(--chayong-success)" }} />
      </div>
      <h1 className="mt-6 text-xl font-bold" style={{ color: "var(--chayong-text)" }}>
        결제가 완료되었습니다
      </h1>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--chayong-text-sub)" }}>
        명의변경 절차를 진행한 뒤 증빙을 등록해 주세요.
      </p>
      <Link
        href={orderId ? `/escrow/${orderId}` : "/"}
        className="mt-6 flex h-12 items-center justify-center rounded-xl px-6 text-[15px] font-semibold text-white"
        style={{ backgroundColor: "var(--chayong-primary)" }}
      >
        거래 내역 보기
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--chayong-bg)" }}>
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Loader2
                size={40}
                className="animate-spin"
                style={{ color: "var(--chayong-primary)" }}
              />
            </div>
          }
        >
          <PaymentSuccessInner />
        </Suspense>
      </div>
    </div>
  );
}
