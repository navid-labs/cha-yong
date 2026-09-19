// src/app/api/sell/plate-lookup/route.test.ts
import { describe, expect, it } from "vitest";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/sell/plate-lookup", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/sell/plate-lookup", () => {
  it("returns 503 (not available) for a valid plate instead of fabricating a vehicle", async () => {
    const res = await POST(req({ plate: "12가3456" }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json).toMatchObject({ error: expect.any(String) });
    // 조작된 차량 정보를 반환하지 않는다
    expect(json).not.toHaveProperty("brand");
    expect(json).not.toHaveProperty("model");
  });

  it("rejects invalid plate format", async () => {
    const res = await POST(req({ plate: "BADPLATE" }));
    expect(res.status).toBe(400);
  });

  it("rejects missing plate", async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
  });
});
