import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const findUnique = vi.fn();
const escrowUpdate = vi.fn();
const listingUpdate = vi.fn();
const listingFindUnique = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    escrowPayment: { findUnique: (...a: unknown[]) => findUnique(...a) },
    $transaction: (fn: (tx: unknown) => unknown) =>
      fn({
        escrowPayment: { update: (...a: unknown[]) => escrowUpdate(...a) },
        listing: {
          update: (...a: unknown[]) => listingUpdate(...a),
          findUnique: (...a: unknown[]) => listingFindUnique(...a),
        },
      }),
  },
}));
vi.mock("@/lib/api/auth-guard", () => ({
  requireRole: vi.fn(async () => ({ userId: "admin1", role: "ADMIN" })),
  isAuthError: () => false,
}));
vi.mock("@/lib/notifications/send", () => ({
  sendBulkNotifications: vi.fn(async () => {}),
}));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://test/api/admin/escrow/e1/verify-transfer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const ctx = { params: Promise.resolve({ id: "e1" }) };

function paidEscrow(overrides: Record<string, unknown> = {}) {
  return {
    id: "e1",
    status: "PAID",
    transferProofKey: "proof-key",
    totalAmount: 1_000_000,
    buyerId: "b1",
    sellerId: "s1",
    listingId: "l1",
    listing: { status: "RESERVED" },
    ...overrides,
  };
}

describe("POST /api/admin/escrow/[id]/verify-transfer", () => {
  beforeEach(() => {
    findUnique.mockReset();
    escrowUpdate.mockReset();
    listingUpdate.mockReset();
    listingFindUnique.mockReset();
  });

  it("reject moves the escrow to DISPUTED (matching the dispute notification)", async () => {
    findUnique.mockResolvedValue(paidEscrow());
    escrowUpdate.mockResolvedValue({});
    listingFindUnique.mockResolvedValue({ id: "l1" });

    const res = await POST(
      req({ action: "reject", rejectionReason: "증빙이 불충분합니다." }),
      ctx
    );

    expect(res.status).toBe(200);
    expect(escrowUpdate).toHaveBeenCalledOnce();
    expect(escrowUpdate.mock.calls[0][0]).toMatchObject({
      data: { status: "DISPUTED" },
    });
  });

  it("approve releases the escrow and marks the listing SOLD", async () => {
    findUnique.mockResolvedValue(paidEscrow());
    escrowUpdate.mockResolvedValue({});
    listingUpdate.mockResolvedValue({});

    const res = await POST(req({ action: "approve" }), ctx);

    expect(res.status).toBe(200);
    expect(escrowUpdate.mock.calls[0][0]).toMatchObject({
      data: { status: "RELEASED" },
    });
    expect(listingUpdate.mock.calls[0][0]).toMatchObject({
      data: { status: "SOLD" },
    });
  });

  it("approve without an uploaded proof is rejected", async () => {
    findUnique.mockResolvedValue(paidEscrow({ transferProofKey: null }));

    const res = await POST(req({ action: "approve" }), ctx);

    expect(res.status).toBe(400);
    expect(escrowUpdate).not.toHaveBeenCalled();
  });
});
