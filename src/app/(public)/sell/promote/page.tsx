import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { PromoteClient } from "@/features/sell/components/promote-client";

export const metadata: Metadata = {
  title: "프로모션 선택",
  description: "매물 프로모션 옵션을 선택하고 결제하세요.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SellPromotePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [user, params] = await Promise.all([getUser(), searchParams]);
  const listingId =
    typeof params.listingId === "string" ? params.listingId : "";

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/sell/promote?listingId=${listingId}`)}`
    );
  }

  return (
    <div className="bg-[var(--chayong-bg)] px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-lg">
        <PromoteClient listingId={listingId} />
      </main>
    </div>
  );
}
