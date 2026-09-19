import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

const promotionUpdateMany = vi.fn();
const promotionFindMany = vi.fn();
const listingUpdateMany = vi.fn();
const $transaction = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    promotion: {
      updateMany: (...a: unknown[]) => promotionUpdateMany(...a),
      findMany: (...a: unknown[]) => promotionFindMany(...a),
    },
    listing: { updateMany: (...a: unknown[]) => listingUpdateMany(...a) },
    $transaction: (...a: unknown[]) => $transaction(...a),
  },
}));
const sendBulkNotifications = vi.fn();
vi.mock("@/lib/notifications/send", () => ({
  sendBulkNotifications: (...a: unknown[]) => sendBulkNotifications(...a),
}));

import { GET } from "./route";

function req(headers: Record<string, string> = {}) {
  return new Request("http://test/api/cron/expire-promotions", {
    headers,
  }) as unknown as NextRequest;
}

describe("GET /api/cron/expire-promotions", () => {
  beforeEach(() => {
    promotionUpdateMany.mockReset();
    promotionFindMany.mockReset();
    listingUpdateMany.mockReset();
    $transaction.mockReset();
    sendBulkNotifications.mockClear();
    promotionFindMany.mockResolvedValue([]);
    $transaction.mockResolvedValue([{ count: 2 }, { count: 3 }]);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("runs without auth when CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      expiredPromotions: 2,
      clearedListings: 3,
    });
    expect($transaction).toHaveBeenCalledOnce();
  });

  it("rejects a missing/incorrect Bearer when CRON_SECRET is set", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    const res = await GET(req({ authorization: "Bearer wrong" }));
    expect(res.status).toBe(401);
    expect($transaction).not.toHaveBeenCalled();
  });

  it("accepts the correct Bearer when CRON_SECRET is set", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    const res = await GET(req({ authorization: "Bearer s3cret" }));
    expect(res.status).toBe(200);
    expect($transaction).toHaveBeenCalledOnce();
  });

  it("notifies the sellers of expiring promotions", async () => {
    vi.stubEnv("CRON_SECRET", "");
    promotionFindMany.mockResolvedValue([
      { sellerId: "s1" },
      { sellerId: "s2" },
    ]);

    const res = await GET(req());

    expect(res.status).toBe(200);
    expect(sendBulkNotifications).toHaveBeenCalledOnce();
    const sent = sendBulkNotifications.mock.calls[0][0] as Array<{
      userId: string;
      type: string;
    }>;
    expect(sent).toHaveLength(2);
    expect(sent[0]).toMatchObject({ userId: "s1", type: "PROMOTION_EXPIRED" });
  });
});
