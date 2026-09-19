import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const findUnique = vi.fn();
const update = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    escrowPayment: {
      findUnique: (...a: unknown[]) => findUnique(...a),
      update: (...a: unknown[]) => update(...a),
    },
  },
}));
vi.mock("@/lib/api/auth-guard", () => ({
  requireRole: vi.fn(async () => ({ userId: "admin1", role: "ADMIN" })),
  isAuthError: () => false,
}));

import { PATCH } from "./route";

function req(status: string) {
  return new Request("http://test/api/admin/escrow/e1", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  }) as unknown as NextRequest;
}
const ctx = { params: Promise.resolve({ id: "e1" }) };

describe("PATCH /api/admin/escrow/[id]", () => {
  beforeEach(() => {
    findUnique.mockReset();
    update.mockReset();
  });

  it("rejects PAID→RELEASED — release must go through verify-transfer (proof-checked)", async () => {
    findUnique.mockResolvedValue({ status: "PAID" });
    const res = await PATCH(req("RELEASED"), ctx);
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("allows PAID→REFUNDED", async () => {
    findUnique.mockResolvedValue({ status: "PAID" });
    update.mockResolvedValue({ id: "e1", status: "REFUNDED" });
    const res = await PATCH(req("REFUNDED"), ctx);
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledOnce();
  });

  it("allows DISPUTED→RELEASED (dispute resolution)", async () => {
    findUnique.mockResolvedValue({ status: "DISPUTED" });
    update.mockResolvedValue({ id: "e1", status: "RELEASED" });
    const res = await PATCH(req("RELEASED"), ctx);
    expect(res.status).toBe(200);
  });
});
