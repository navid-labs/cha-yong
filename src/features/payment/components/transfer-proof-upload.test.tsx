import { describe, it, expect } from "vitest";

import { validateProofFile } from "./transfer-proof-upload";

function fileOf(type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], "proof", { type });
}

describe("validateProofFile", () => {
  it("accepts an allowed image under the size limit", () => {
    expect(validateProofFile(fileOf("image/jpeg", 1024))).toEqual({ ok: true });
  });

  it("accepts a PDF under the size limit", () => {
    expect(validateProofFile(fileOf("application/pdf", 1024))).toEqual({ ok: true });
  });

  it("rejects a disallowed type", () => {
    const result = validateProofFile(fileOf("image/gif", 1024));
    expect(result.ok).toBe(false);
  });

  it("rejects a file over 20MB", () => {
    const result = validateProofFile(fileOf("image/png", 20 * 1024 * 1024 + 1));
    expect(result.ok).toBe(false);
  });
});
