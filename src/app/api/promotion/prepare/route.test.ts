import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const listingFindUnique = vi.fn();
const promotionCreate = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    listing: { findUnique: (...a: unknown[]) => listingFindUnique(...a) },
    promotion: { create: (...a: unknown[]) => promotionCreate(...a) },
  },
}));
vi.mock("@/lib/api/auth-guard", () => ({
  requireActiveProfile: vi.fn(async () => ({ userId: "s1", role: "SELLER" })),
  isAuthError: () => false,
}));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://test/api/promotion/prepare", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/promotion/prepare", () => {
  beforeEach(() => {
    listingFindUnique.mockReset();
    promotionCreate.mockReset();
    promotionCreate.mockResolvedValue({ id: "promo1", amount: 19_900 });
  });

  it("creates a PENDING promotion with the server-computed amount", async () => {
    listingFindUnique.mockResolvedValue({ id: "l1", sellerId: "s1" });

    const res = await POST(
      req({ listingId: "l1", tier: "TOP_EXPOSURE", durationDays: 7 })
    );

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toMatchObject({ id: "promo1", orderId: "promo1", amount: 19_900 });
    expect(promotionCreate.mock.calls[0][0]).toMatchObject({
      data: {
        listingId: "l1",
        sellerId: "s1",
        tier: "TOP_EXPOSURE",
        durationDays: 7,
        amount: 19_900,
        status: "PENDING",
      },
    });
  });

  it("computes the amount server-side and ignores a forged client amount", async () => {
    listingFindUnique.mockResolvedValue({ id: "l1", sellerId: "s1" });

    await POST(
      req({ listingId: "l1", tier: "HOME_FEATURED", durationDays: 30, amount: 1 })
    );

    expect(promotionCreate.mock.calls[0][0]).toMatchObject({
      data: { amount: 99_900 },
    });
  });

  it("rejects a missing listingId", async () => {
    const res = await POST(req({ tier: "TOP_EXPOSURE", durationDays: 7 }));
    expect(res.status).toBe(400);
    expect(promotionCreate).not.toHaveBeenCalled();
  });

  it("rejects an invalid tier/duration", async () => {
    const res = await POST(
      req({ listingId: "l1", tier: "PLATINUM", durationDays: 7 })
    );
    expect(res.status).toBe(400);
    expect(listingFindUnique).not.toHaveBeenCalled();
    expect(promotionCreate).not.toHaveBeenCalled();
  });

  it("returns 404 when the listing does not exist", async () => {
    listingFindUnique.mockResolvedValue(null);

    const res = await POST(
      req({ listingId: "gone", tier: "TOP_EXPOSURE", durationDays: 7 })
    );
    expect(res.status).toBe(404);
    expect(promotionCreate).not.toHaveBeenCalled();
  });

  it("rejects promoting a listing the caller does not own", async () => {
    listingFindUnique.mockResolvedValue({ id: "l1", sellerId: "other" });

    const res = await POST(
      req({ listingId: "l1", tier: "TOP_EXPOSURE", durationDays: 7 })
    );
    expect(res.status).toBe(403);
    expect(promotionCreate).not.toHaveBeenCalled();
  });
});
