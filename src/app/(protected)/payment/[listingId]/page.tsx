import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getProfile } from "@/lib/supabase/auth";
import { EscrowCheckout } from "@/features/payment/components/escrow-checkout";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ listingId: string }>;
}

export const metadata: Metadata = {
  title: "안전거래 결제",
  description: "에스크로 방식으로 안전하게 결제하세요.",
};

export default async function PaymentPage({ params }: PageProps) {
  const { listingId } = await params;

  const profile = await getProfile();
  if (!profile) redirect("/login");

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      monthlyPayment: true,
      initialCost: true,
      transferFee: true,
      sellerId: true,
    },
  });

  if (!listing) notFound();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--chayong-bg)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-3"
        style={{
          backgroundColor: "var(--chayong-bg)",
          borderColor: "var(--chayong-divider)",
        }}
      >
        <Link
          href={`/detail/${listingId}`}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--chayong-text)" }}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={22} />
        </Link>
        <h1
          className="text-base font-bold"
          style={{ color: "var(--chayong-text)" }}
        >
          안전거래 결제
        </h1>
      </header>

      {/* Checkout content */}
      <div className="mx-auto max-w-lg px-4 py-6">
        <EscrowCheckout
          listing={{
            id: listing.id,
            brand: listing.brand,
            model: listing.model,
            year: listing.year,
            monthlyPayment: listing.monthlyPayment,
            initialCost: listing.initialCost ?? 0,
            transferFee: listing.transferFee ?? 0,
          }}
          buyerId={profile.id}
        />
      </div>
    </div>
  );
}
