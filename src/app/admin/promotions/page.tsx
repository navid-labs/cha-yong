import { z } from "zod";
import { PromotionStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  parsePagination,
  paginationMeta,
  toURLSearchParams,
} from "@/lib/api/pagination";
import { validateQuery } from "@/lib/api/validation";
import { PromotionAdminTable } from "@/features/admin/components/promotion-admin-table";
import { PaginationBar } from "@/features/admin/components/pagination-bar";
import { StatusFilterBar } from "@/features/admin/components/status-filter-bar";
import { AdminErrorView } from "@/features/admin/components/admin-error-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "프로모션 관리" };

const promotionQuerySchema = z.object({
  status: z.nativeEnum(PromotionStatus).optional(),
  page: z.string().optional(),
  size: z.string().optional(),
});

const STATUS_OPTIONS = [
  { value: "PENDING", label: "결제대기" },
  { value: "ACTIVE", label: "노출중" },
  { value: "EXPIRED", label: "만료" },
  { value: "CANCELLED", label: "취소" },
];

export default async function AdminPromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; size?: string }>;
}) {
  const sp = await searchParams;
  const urlParams = toURLSearchParams(sp);

  const validation = validateQuery(promotionQuerySchema, urlParams);
  if (!validation.ok) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--chayong-text)" }}>
          프로모션 관리
        </h1>
        <AdminErrorView message="잘못된 필터입니다." resetHref="/admin/promotions" />
      </div>
    );
  }

  const { page, size } = parsePagination(urlParams);
  const where: Prisma.PromotionWhereInput | undefined = validation.data.status
    ? { status: validation.data.status }
    : undefined;

  const [promotions, total] = await Promise.all([
    prisma.promotion.findMany({
      where,
      include: {
        listing: { select: { id: true, brand: true, model: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.promotion.count({ where }),
  ]);

  const serialized = promotions.map((p) => ({
    id: p.id,
    tier: p.tier,
    status: p.status,
    amount: p.amount,
    durationDays: p.durationDays,
    startsAt: p.startsAt?.toISOString() ?? null,
    expiresAt: p.expiresAt?.toISOString() ?? null,
    paidAt: p.paidAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    listing: p.listing,
    seller: p.seller,
  }));

  const tableKey = validation.data.status ?? "__all__";

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ color: "var(--chayong-text)" }}>
        프로모션 관리
      </h1>
      <StatusFilterBar
        options={STATUS_OPTIONS}
        current={validation.data.status}
        basePath="/admin/promotions"
      />
      <PromotionAdminTable key={tableKey} promotions={serialized} />
      <PaginationBar
        pagination={paginationMeta(page, size, total)}
        basePath="/admin/promotions"
        preserveParams={{ status: validation.data.status }}
      />
    </div>
  );
}
