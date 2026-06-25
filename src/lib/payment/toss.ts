// Toss Payments 서버 결제 승인(confirm) — 위변조 방지의 핵심.
// 클라이언트가 보낸 paymentId만으로 PAID 전이를 허용하면 위조가 가능하므로,
// 운영 환경(TOSS_SECRET 존재)에서는 반드시 Toss 서버에 직접 승인 요청을 보내고
// 반환된 orderId·금액이 우리 기록과 일치하는지 검증한다.

const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

export class TossVerificationError extends Error {
  constructor(
    message: string,
    readonly code?: string
  ) {
    super(message);
    this.name = "TossVerificationError";
  }
}

type VerifyInput = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

/**
 * Toss에 결제 승인을 요청하고, 응답의 orderId·금액이 기대값과 일치하는지 검증한다.
 * 실패(네트워크/Toss 거절/금액·주문 불일치) 시 throw 하여 호출부가 PAID 전이를 막도록 한다.
 */
export async function verifyTossPayment({
  paymentKey,
  orderId,
  amount,
}: VerifyInput): Promise<void> {
  const secret = process.env.TOSS_SECRET;
  if (!secret) {
    throw new TossVerificationError("TOSS_SECRET이 설정되지 않았습니다.");
  }

  // Basic 인증: base64(secretKey + ":") — 콜론 뒤 비밀번호는 비움.
  const auth = Buffer.from(`${secret}:`).toString("base64");

  let res: Response;
  try {
    res = await fetch(TOSS_CONFIRM_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
  } catch {
    throw new TossVerificationError("토스 승인 요청에 실패했습니다.", "NETWORK_ERROR");
  }

  const data = (await res.json().catch(() => ({}))) as {
    orderId?: string;
    totalAmount?: number;
    status?: string;
    code?: string;
    message?: string;
  };

  if (!res.ok) {
    throw new TossVerificationError(
      data.message ?? "토스 결제 승인이 거절되었습니다.",
      data.code
    );
  }

  // 카드 결제 완료 status는 "DONE". 그 외(예: 가상계좌 WAITING_FOR_DEPOSIT)는 입금 미완료.
  if (data.status !== "DONE") {
    throw new TossVerificationError("결제가 완료되지 않았습니다.", "PAYMENT_NOT_DONE");
  }

  // 위변조 방지: Toss가 확정한 주문번호·금액이 우리 기록과 일치해야 한다.
  if (data.orderId !== orderId) {
    throw new TossVerificationError("주문번호가 일치하지 않습니다.", "ORDER_ID_MISMATCH");
  }
  if (data.totalAmount !== amount) {
    throw new TossVerificationError("결제 금액이 일치하지 않습니다.", "AMOUNT_MISMATCH");
  }
}
