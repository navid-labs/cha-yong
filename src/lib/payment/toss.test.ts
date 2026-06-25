import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { verifyTossPayment, TossVerificationError } from "./toss";

const OK_INPUT = { paymentKey: "pk_1", orderId: "order_1", amount: 1_000_000 };

function mockFetchOnce(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("verifyTossPayment", () => {
  beforeEach(() => {
    vi.stubEnv("TOSS_SECRET", "test_sk_secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("resolves and calls Toss confirm with Basic auth when the payment matches", async () => {
    const fetchMock = mockFetchOnce(200, {
      status: "DONE",
      orderId: "order_1",
      totalAmount: 1_000_000,
    });

    await expect(verifyTossPayment(OK_INPUT)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.tosspayments.com/v1/payments/confirm");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe(
      `Basic ${Buffer.from("test_sk_secret:").toString("base64")}`
    );
    expect(JSON.parse(init.body as string)).toEqual({
      paymentKey: "pk_1",
      orderId: "order_1",
      amount: 1_000_000,
    });
  });

  it("throws when TOSS_SECRET is missing", async () => {
    vi.stubEnv("TOSS_SECRET", "");
    await expect(verifyTossPayment(OK_INPUT)).rejects.toBeInstanceOf(
      TossVerificationError
    );
  });

  it("throws when Toss rejects the confirm request", async () => {
    mockFetchOnce(403, { code: "FORBIDDEN_REQUEST", message: "금액 불일치" });
    await expect(verifyTossPayment(OK_INPUT)).rejects.toBeInstanceOf(
      TossVerificationError
    );
  });

  it("throws when the payment status is not DONE", async () => {
    mockFetchOnce(200, {
      status: "WAITING_FOR_DEPOSIT",
      orderId: "order_1",
      totalAmount: 1_000_000,
    });
    await expect(verifyTossPayment(OK_INPUT)).rejects.toMatchObject({
      code: "PAYMENT_NOT_DONE",
    });
  });

  it("throws when the returned orderId does not match", async () => {
    mockFetchOnce(200, {
      status: "DONE",
      orderId: "tampered",
      totalAmount: 1_000_000,
    });
    await expect(verifyTossPayment(OK_INPUT)).rejects.toMatchObject({
      code: "ORDER_ID_MISMATCH",
    });
  });

  it("throws when the returned amount does not match", async () => {
    mockFetchOnce(200, {
      status: "DONE",
      orderId: "order_1",
      totalAmount: 999,
    });
    await expect(verifyTossPayment(OK_INPUT)).rejects.toMatchObject({
      code: "AMOUNT_MISMATCH",
    });
  });
});
