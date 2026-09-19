import { describe, it, expect } from "vitest";

import { canViewEscrow } from "./escrow";

const ESCROW = { buyerId: "buyer-1", sellerId: "seller-1" };

describe("canViewEscrow", () => {
  it("allows the buyer", () => {
    expect(canViewEscrow({ id: "buyer-1", role: "BUYER" }, ESCROW)).toBe(true);
  });

  it("allows the seller", () => {
    expect(canViewEscrow({ id: "seller-1", role: "SELLER" }, ESCROW)).toBe(true);
  });

  it("allows an admin who is not a participant", () => {
    expect(canViewEscrow({ id: "admin-1", role: "ADMIN" }, ESCROW)).toBe(true);
  });

  it("denies an unrelated buyer", () => {
    expect(canViewEscrow({ id: "stranger-1", role: "BUYER" }, ESCROW)).toBe(
      false
    );
  });

  it("denies a dealer who is not a participant (only ADMIN bypasses participation)", () => {
    expect(canViewEscrow({ id: "dealer-1", role: "DEALER" }, ESCROW)).toBe(
      false
    );
  });
});
