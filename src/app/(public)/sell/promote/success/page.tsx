import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "프로모션 결제 완료",
  description: "프로모션 결제가 성공적으로 완료되었습니다.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PromoteSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orderName =
    typeof params.orderName === "string"
      ? decodeURIComponent(params.orderName)
      : "프로모션";
  const amount =
    typeof params.amount === "string" ? Number(params.amount) : 0;

  return (
    <div className="bg-[var(--chayong-bg)] px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-lg">
        <div className="flex flex-col items-center rounded-xl border border-[var(--chayong-border)] bg-white p-8 shadow-sm text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <CheckCircle size={40} style={{ color: "var(--chayong-success)" }} />
          </div>

          <h1
            className="mt-6 text-xl font-bold"
            style={{ color: "var(--chayong-text)" }}
          >
            프로모션 결제 완료
          </h1>

          <div
            className="mt-4 w-full rounded-xl p-4"
            style={{
              backgroundColor: "var(--chayong-surface)",
              border: "1px solid var(--chayong-border)",
            }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--chayong-text-sub)" }}>상품</span>
              <span
                className="font-medium"
                style={{ color: "var(--chayong-text)" }}
              >
                {orderName}
              </span>
            </div>
            {amount > 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span style={{ color: "var(--chayong-text-sub)" }}>
                  결제 금액
                </span>
                <span
                  className="font-bold"
                  style={{ color: "var(--chayong-primary)" }}
                >
                  {amount.toLocaleString("ko-KR")}원
                </span>
              </div>
            )}
          </div>

          <p
            className="mt-4 text-sm"
            style={{ color: "var(--chayong-text-sub)" }}
          >
            프로모션이 적용되면 매물이 더 많은 구매자에게 노출됩니다.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <Link
              href="/my/listings"
              className="flex-1 flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors"
              style={{
                backgroundColor: "var(--chayong-primary)",
                color: "white",
              }}
            >
              내 매물 보기
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors"
              style={{
                backgroundColor: "var(--chayong-surface)",
                color: "var(--chayong-text-sub)",
                border: "1px solid var(--chayong-border)",
              }}
            >
              홈으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
