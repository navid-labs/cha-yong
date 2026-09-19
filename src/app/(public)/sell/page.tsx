import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/auth";
import { SellEntry } from "@/features/sell/components/sell-entry";

export const metadata: Metadata = {
  title: "내 차 등록 시작",
  description: "차량번호를 먼저 조회하고 승계·리스·렌트 매물 등록을 이어가세요.",
};

export default async function SellPage() {
  const user = await getUser();

  return (
    <div className="bg-[var(--chayong-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="mb-6 overflow-hidden rounded-2xl border border-[color:var(--chayong-primary)]/15 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 bg-[linear-gradient(135deg,rgba(18,89,233,0.08),rgba(18,89,233,0.02))] p-6 sm:p-8">
              <div className="inline-flex w-fit items-center rounded-full border border-[color:var(--chayong-primary)]/20 bg-white px-3 py-1 text-xs font-semibold text-[var(--chayong-primary)]">
                공개 등록 안내
              </div>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--chayong-text)] sm:text-4xl">
                일반 등록 무료와 매니저 대행 빠른승계를 먼저 구분해 보세요
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[var(--chayong-text-sub)] sm:text-base">
                일반 등록은 무료로 시작할 수 있고, 매니저 대행 빠른승계는 상담과 검수 후 최종
                금액을 확정합니다.
              </p>
            </div>

            <div className="grid gap-px bg-[var(--chayong-border)] lg:border-l lg:border-[var(--chayong-border)]">
              <div className="bg-white p-6 sm:p-7">
                <p className="text-xs font-semibold text-[var(--chayong-primary)]">일반 등록 무료</p>
                <h2 className="mt-2 text-lg font-bold text-[var(--chayong-text)]">직접 등록 흐름</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--chayong-text-sub)]">
                  차량 정보를 직접 입력하고 공개 등록을 이어가는 기본 경로입니다.
                </p>
              </div>

              <div className="bg-[color:var(--chayong-primary)]/5 p-6 sm:p-7">
                <p className="text-xs font-semibold text-[var(--chayong-primary)]">매니저 대행 빠른승계</p>
                <h2 className="mt-2 text-lg font-bold text-[var(--chayong-text)]">상담 후 확정 안내</h2>
                <div className="mt-4 space-y-2 text-sm leading-6 text-[var(--chayong-text-sub)]">
                  <p>등록비 99,000원</p>
                  <p>완료 수수료: 중고차 시세 4%</p>
                  <p>최저 수수료 770,000원, VAT 포함</p>
                </div>
                <p className="mt-4 rounded-xl border border-[color:var(--chayong-primary)]/15 bg-white px-4 py-3 text-sm font-medium text-[var(--chayong-text-sub)]">
                  상담 및 검수 후 최종 금액을 확정하며, 실제 결제나 저장 정책처럼 보이지 않도록
                  안내합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SellEntry isAuthenticated={Boolean(user)} />
      </div>
    </div>
  );
}
