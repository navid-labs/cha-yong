import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EscrowStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { getProfile } from "@/lib/supabase/auth";
import { canViewEscrow } from "@/lib/payment/escrow";
import { BUCKET, createSignedKeyUrl } from "@/lib/supabase/storage";
import { formatKRW, formatDate } from "@/lib/utils/format";
import { TransferProofUpload } from "@/features/payment/components/transfer-proof-upload";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "에스크로 거래 내역",
  description: "안전거래 결제 진행 상황을 확인하세요.",
};

const STATUS_META: Record<
  EscrowStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "결제 대기", color: "#687684", bg: "#F2F4F6" },
  PAID: { label: "결제 완료", color: "#3182F6", bg: "#EBF2FF" },
  RELEASED: { label: "거래 완료", color: "#15803D", bg: "#F0FDF4" },
  REFUNDED: { label: "환불 완료", color: "#687684", bg: "#F2F4F6" },
  DISPUTED: { label: "확인 필요", color: "#B91C1C", bg: "#FEF2F2" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function vehicleLabel(brand: string | null, model: string | null): string {
  return [brand, model].filter(Boolean).join(" ") || "매물";
}

export default async function EscrowDetailPage({ params }: PageProps) {
  const { id } = await params;

  const profile = await getProfile();
  if (!profile) redirect("/login");

  const escrow = await prisma.escrowPayment.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, brand: true, model: true, year: true } },
    },
  });

  if (!escrow) notFound();

  // Don't leak existence to unrelated users.
  if (!canViewEscrow(profile, escrow)) notFound();

  const isBuyer = escrow.buyerId === profile.id;
  const isSeller = escrow.sellerId === profile.id;

  let signedProofUrl: string | null = null;
  if (escrow.transferProofKey) {
    try {
      signedProofUrl = await createSignedKeyUrl(
        BUCKET.TRANSFER_PROOFS,
        escrow.transferProofKey,
        3600
      );
    } catch {
      signedProofUrl = null;
    }
  }

  const status = STATUS_META[escrow.status];
  const canUploadProof = escrow.status === "PAID" && (isBuyer || isSeller);

  const rows = [
    { label: "가계약금", value: formatKRW(escrow.depositAmount) },
    { label: "승계 대행 수수료", value: formatKRW(escrow.transferFee) },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--chayong-bg)" }}>
      <header
        className="sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-3"
        style={{
          backgroundColor: "var(--chayong-bg)",
          borderColor: "var(--chayong-divider)",
        }}
      >
        <Link
          href="/my"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--chayong-text)" }}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-base font-bold" style={{ color: "var(--chayong-text)" }}>
          에스크로 거래 내역
        </h1>
      </header>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* Status + vehicle */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "var(--chayong-surface)",
            border: "1px solid var(--chayong-border)",
          }}
        >
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            {status.label}
          </span>
          <p className="mt-3 text-base font-bold" style={{ color: "var(--chayong-text)" }}>
            {vehicleLabel(escrow.listing.brand, escrow.listing.model)}
            {escrow.listing.year && (
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--chayong-text-sub)" }}
              >
                {escrow.listing.year}년식
              </span>
            )}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--chayong-text-caption)" }}>
            결제 요청일 {formatDate(escrow.createdAt, { short: true })}
            {escrow.paidAt && ` · 결제일 ${formatDate(escrow.paidAt, { short: true })}`}
          </p>
        </div>

        {/* Amount breakdown */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--chayong-border)" }}
        >
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: "var(--chayong-divider)" }}
            >
              <span className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
                {row.label}
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--chayong-text)" }}>
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-bold" style={{ color: "var(--chayong-text)" }}>
              총 결제금액
            </span>
            <span className="text-lg font-bold" style={{ color: "var(--chayong-primary)" }}>
              {formatKRW(escrow.totalAmount)}
            </span>
          </div>
        </div>

        {/* Dispute reason */}
        {escrow.status === "DISPUTED" && escrow.rejectionReason && (
          <div
            className="rounded-2xl px-5 py-4"
            style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--chayong-danger)" }}>
              증빙 확인이 필요합니다
            </p>
            <p className="mt-1 text-sm" style={{ color: "#B91C1C" }}>
              {escrow.rejectionReason}
            </p>
          </div>
        )}

        {/* Transfer proof */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ border: "1px solid var(--chayong-border)" }}
        >
          <h2 className="text-sm font-bold" style={{ color: "var(--chayong-text)" }}>
            명의변경 증빙
          </h2>

          {canUploadProof ? (
            <TransferProofUpload
              escrowId={escrow.id}
              initialProofKey={escrow.transferProofKey}
              initialSignedUrl={signedProofUrl}
            />
          ) : escrow.transferProofKey ? (
            <div className="flex items-center justify-between rounded-lg border border-[var(--chayong-divider)] px-3 py-2">
              <span className="text-sm" style={{ color: "var(--chayong-text)" }}>
                증빙이 업로드되었습니다
              </span>
              {signedProofUrl && (
                <a
                  href={signedProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium"
                  style={{ color: "var(--chayong-primary)" }}
                >
                  미리보기
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--chayong-text-sub)" }}>
              {escrow.status === "PENDING"
                ? "결제 완료 후 명의변경 증빙을 업로드할 수 있습니다."
                : "아직 등록된 증빙이 없습니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
