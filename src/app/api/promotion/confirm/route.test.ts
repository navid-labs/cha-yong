import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

const findUnique = vi.fn();
const promotionUpdate = vi.fn();
const listingUpdateMany = vi.fn();
const verifyTossPayment = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    promotion: { findUnique: (...a: unknown[]) => findUnique(...a) },
    $transaction: (fn: (tx: unknown) => unknown) =>
      fn({
        promotion: { update: (...a: unknown[]) => promotionUpdate(...a) },
        listing: { updateMany: (...a: unknown[]) => listingUpdateMany(...a) },
      }),
  },
}));
vi.mock("@/lib/api/auth-guard", () => ({
  requireActiveProfile: vi.fn(async () => ({ userId: "s1", role: "SELLER" })),
  isAuthError: () => false,
}));
vi.mock("@/lib/payment/toss", () => ({
  verifyTossPayment: (...a: unknown[]) => verifyTossPayment(...a),
}));
const sendNotification = vi.fn();
vi.mock("@/lib/notifications/send", () => ({
  sendNotification: (...a: unknown[]) => sendNotification(...a),
}));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://test/api/promotion/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function pendingPromotion(overrides: Record<string, unknown> = {}) {
  return {
    id: "promo1",
    status: "PENDING",
    sellerId: "s1",
    listingId: "l1",
    tier: "TOP_EXPOSURE",
    durationDays: 7,
    amount: 19_900,
    ...overrides,
  };
}

describe("POST /api/promotion/confirm", () => {
  beforeEach(() => {
    findUnique.mockReset();
    promotionUpdate.mockReset();
    listingUpdateMany.mockReset();
    verifyTossPayment.mockReset();
    promotionUpdate.mockResolvedValue({ id: "promo1", status: "ACTIVE" });
    listingUpdateMany.mockResolvedValue({ count: 1 });
    sendNotification.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("test mode (no TOSS_SECRET, no pgPaymentKey) activates and sets exposure weight", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingPromotion());

    const res = await POST(req({ promotionId: "promo1" }));

    expect(res.status).toBe(200);
    expect(promotionUpdate.mock.calls[0][0]).toMatchObject({
      data: { status: "ACTIVE" },
    });
    expect(listingUpdateMany.mock.calls[0][0]).toMatchObject({
      where: { id: "l1" },
      data: { promotionTier: "TOP_EXPOSURE" },
    });
    // promotedUntil must be set to a future date
    const data = listingUpdateMany.mock.calls[0][0] as {
      data: { promotedUntil: Date };
    };
    expect(data.data.promotedUntil.getTime()).toBeGreaterThan(Date.now());
    expect(verifyTossPayment).not.toHaveBeenCalled();
    expect(sendNotification).toHaveBeenCalledOnce();
    expect(sendNotification.mock.calls[0][0]).toMatchObject({
      userId: "s1",
      type: "PROMOTION_ACTIVATED",
    });
  });

  it("production (TOSS_SECRET set) WITHOUT pgPaymentKey is rejected and stays PENDING", async () => {
    vi.stubEnv("TOSS_SECRET", "test_sk_xxx");
    findUnique.mockResolvedValue(pendingPromotion());

    const res = await POST(req({ promotionId: "promo1" }));

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(promotionUpdate).not.toHaveBeenCalled();
    expect(verifyTossPayment).not.toHaveBeenCalled();
  });

  it("production with valid Toss verification activates against the server amount", async () => {
    vi.stubEnv("TOSS_SECRET", "test_sk_xxx");
    findUnique.mockResolvedValue(pendingPromotion());
    verifyTossPayment.mockResolvedValue(undefined);

    const res = await POST(
      req({ promotionId: "promo1", pgPaymentKey: "pk_1", pgOrderId: "promo1" })
    );

    expect(res.status).toBe(200);
    expect(verifyTossPayment.mock.calls[0][0]).toMatchObject({
      paymentKey: "pk_1",
      orderId: "promo1",
      amount: 19_900,
    });
    expect(promotionUpdate).toHaveBeenCalledOnce();
  });

  it("production with a failing Toss verification is rejected and stays PENDING", async () => {
    vi.stubEnv("TOSS_SECRET", "test_sk_xxx");
    findUnique.mockResolvedValue(pendingPromotion());
    verifyTossPayment.mockRejectedValue(new Error("amount mismatch"));

    const res = await POST(
      req({ promotionId: "promo1", pgPaymentKey: "pk_1", pgOrderId: "promo1" })
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(promotionUpdate).not.toHaveBeenCalled();
  });

  it("fails closed: pgPaymentKey present but no TOSS_SECRET to verify against", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingPromotion());

    const res = await POST(
      req({ promotionId: "promo1", pgPaymentKey: "pk_1", pgOrderId: "promo1" })
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(promotionUpdate).not.toHaveBeenCalled();
    expect(verifyTossPayment).not.toHaveBeenCalled();
  });

  it("rejects confirming someone else's promotion", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingPromotion({ sellerId: "other" }));

    const res = await POST(req({ promotionId: "promo1" }));

    expect(res.status).toBe(403);
    expect(promotionUpdate).not.toHaveBeenCalled();
  });

  it("rejects a non-PENDING promotion with 409 (idempotent)", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingPromotion({ status: "ACTIVE" }));

    const res = await POST(req({ promotionId: "promo1" }));

    expect(res.status).toBe(409);
    expect(promotionUpdate).not.toHaveBeenCalled();
  });
});
