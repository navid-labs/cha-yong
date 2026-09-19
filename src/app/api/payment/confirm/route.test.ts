import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

const findUnique = vi.fn();
const escrowUpdate = vi.fn();
const listingUpdateMany = vi.fn();
const verifyTossPayment = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    escrowPayment: { findUnique: (...a: unknown[]) => findUnique(...a) },
    $transaction: (fn: (tx: unknown) => unknown) =>
      fn({
        escrowPayment: { update: (...a: unknown[]) => escrowUpdate(...a) },
        listing: { updateMany: (...a: unknown[]) => listingUpdateMany(...a) },
      }),
  },
}));
vi.mock("@/lib/api/auth-guard", () => ({
  requireActiveProfile: vi.fn(async () => ({ userId: "b1", role: "BUYER" })),
  isAuthError: () => false,
}));
vi.mock("@/lib/notifications/send", () => ({
  sendBulkNotifications: vi.fn(async () => {}),
}));
vi.mock("@/lib/payment/toss", () => ({
  verifyTossPayment: (...a: unknown[]) => verifyTossPayment(...a),
}));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://test/api/payment/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function pendingEscrow(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay1",
    status: "PENDING",
    buyerId: "b1",
    sellerId: "s1",
    listingId: "l1",
    totalAmount: 1_000_000,
    ...overrides,
  };
}

describe("POST /api/payment/confirm", () => {
  beforeEach(() => {
    findUnique.mockReset();
    escrowUpdate.mockReset();
    listingUpdateMany.mockReset();
    verifyTossPayment.mockReset();
    escrowUpdate.mockResolvedValue({ id: "pay1", status: "PAID" });
    listingUpdateMany.mockResolvedValue({ count: 1 });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("test mode (no TOSS_SECRET, no pgPaymentKey) transitions to PAID", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingEscrow());

    const res = await POST(req({ paymentId: "pay1" }));

    expect(res.status).toBe(200);
    expect(escrowUpdate).toHaveBeenCalledOnce();
    expect(escrowUpdate.mock.calls[0][0]).toMatchObject({ data: { status: "PAID" } });
    expect(verifyTossPayment).not.toHaveBeenCalled();
  });

  it("production (TOSS_SECRET set) WITHOUT pgPaymentKey is rejected and stays PENDING", async () => {
    vi.stubEnv("TOSS_SECRET", "test_sk_xxx");
    findUnique.mockResolvedValue(pendingEscrow());

    const res = await POST(req({ paymentId: "pay1" }));

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(escrowUpdate).not.toHaveBeenCalled();
    expect(verifyTossPayment).not.toHaveBeenCalled();
  });

  it("production with valid Toss verification transitions to PAID", async () => {
    vi.stubEnv("TOSS_SECRET", "test_sk_xxx");
    findUnique.mockResolvedValue(pendingEscrow());
    verifyTossPayment.mockResolvedValue(undefined);

    const res = await POST(
      req({ paymentId: "pay1", pgPaymentKey: "pk_1", pgOrderId: "pay1" })
    );

    expect(res.status).toBe(200);
    expect(verifyTossPayment).toHaveBeenCalledOnce();
    expect(verifyTossPayment.mock.calls[0][0]).toMatchObject({
      paymentKey: "pk_1",
      orderId: "pay1",
      amount: 1_000_000,
    });
    expect(escrowUpdate).toHaveBeenCalledOnce();
  });

  it("production with a failing Toss verification is rejected and stays PENDING", async () => {
    vi.stubEnv("TOSS_SECRET", "test_sk_xxx");
    findUnique.mockResolvedValue(pendingEscrow());
    verifyTossPayment.mockRejectedValue(new Error("amount mismatch"));

    const res = await POST(
      req({ paymentId: "pay1", pgPaymentKey: "pk_1", pgOrderId: "pay1" })
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(escrowUpdate).not.toHaveBeenCalled();
  });

  it("fails closed: pgPaymentKey present but no TOSS_SECRET to verify against", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingEscrow());

    const res = await POST(
      req({ paymentId: "pay1", pgPaymentKey: "pk_1", pgOrderId: "pay1" })
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(escrowUpdate).not.toHaveBeenCalled();
    expect(verifyTossPayment).not.toHaveBeenCalled();
  });

  it("rejects confirming someone else's payment", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingEscrow({ buyerId: "other" }));

    const res = await POST(req({ paymentId: "pay1" }));

    expect(res.status).toBe(403);
    expect(escrowUpdate).not.toHaveBeenCalled();
  });

  it("rejects a non-PENDING payment with 409", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    findUnique.mockResolvedValue(pendingEscrow({ status: "PAID" }));

    const res = await POST(req({ paymentId: "pay1" }));

    expect(res.status).toBe(409);
    expect(escrowUpdate).not.toHaveBeenCalled();
  });
});
