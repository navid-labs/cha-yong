import { describe, it, expect } from "vitest";

import { resolvePromotionAmount } from "./constants";

describe("resolvePromotionAmount", () => {
  it("returns the server-computed amount for a valid tier+duration", () => {
    expect(resolvePromotionAmount("TOP_EXPOSURE", 7)).toEqual({
      tier: "TOP_EXPOSURE",
      durationDays: 7,
      amount: 19_900,
    });
    expect(resolvePromotionAmount("HOME_FEATURED", 30)).toEqual({
      tier: "HOME_FEATURED",
      durationDays: 30,
      amount: 99_900,
    });
  });

  it("rejects an unknown tier", () => {
    expect(resolvePromotionAmount("PLATINUM", 7)).toBeNull();
  });

  it("rejects an unsupported duration", () => {
    expect(resolvePromotionAmount("TOP_EXPOSURE", 14)).toBeNull();
  });

  it("rejects a non-integer / NaN duration", () => {
    expect(resolvePromotionAmount("TOP_EXPOSURE", Number.NaN)).toBeNull();
  });
});
