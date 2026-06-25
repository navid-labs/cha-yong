import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "프로모션 결제 실패",
  description: "결제 처리 중 문제가 발생했습니다.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PromoteFailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : "";
  const message =
    typeof params.message === "string" ? params.message : "결제가 취소되었습니다.";
  // promote-client가 failUrl에 listingId를 직접 실어 보낸다(Toss가 code/message를 덧붙임).
  const listingId = typeof params.listingId === "string" ? params.listingId : null;

  return (
    <div className="bg-[var(--chayong-bg)] px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-lg">
        <div className="flex flex-col items-center rounded-xl border border-[var(--chayong-border)] bg-white p-8 shadow-sm text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <XCircle size={40} style={{ color: "var(--chayong-danger)" }} />
          </div>

          <h1
            className="mt-6 text-xl font-bold"
            style={{ color: "var(--chayong-text)" }}
          >
            결제에 실패했습니다
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--chayong-text-sub)" }}
          >
            {message}
          </p>

          {code && (
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--chayong-text-caption)" }}
            >
              오류 코드: {code}
            </p>
          )}

          <div className="mt-6 flex w-full gap-3">
            {listingId ? (
              <Link
                href={`/sell/promote?listingId=${listingId}`}
                className="flex-1 flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors"
                style={{
                  backgroundColor: "var(--chayong-primary)",
                  color: "white",
                }}
              >
                다시 시도
              </Link>
            ) : null}
            <Link
              href="/my/listings"
              className={`${listingId ? "flex-1" : "w-full"} flex items-center justify-center rounded-xl h-12 text-[15px] font-semibold transition-colors`}
              style={{
                backgroundColor: "var(--chayong-surface)",
                color: "var(--chayong-text-sub)",
                border: "1px solid var(--chayong-border)",
              }}
            >
              건너뛰기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
