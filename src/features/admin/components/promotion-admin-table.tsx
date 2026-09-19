type PromotionRow = {
  id: string;
  tier: string;
  status: string;
  amount: number;
  durationDays: number;
  startsAt: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  createdAt: string;
  listing: { id: string; brand: string | null; model: string | null };
  seller: { id: string; name: string | null; email: string };
};

const TIER_LABELS: Record<string, string> = {
  TOP_EXPOSURE: "목록 상단",
  HOME_FEATURED: "홈 추천",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "결제대기",
  ACTIVE: "노출중",
  EXPIRED: "만료",
  CANCELLED: "취소",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "var(--chayong-surface)", color: "var(--chayong-text-caption)" },
  ACTIVE: { bg: "var(--chayong-primary-light)", color: "var(--chayong-primary)" },
  EXPIRED: { bg: "var(--chayong-surface)", color: "var(--chayong-text-caption)" },
  CANCELLED: { bg: "#FFF7ED", color: "var(--chayong-warning)" },
};

function fmtDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString("ko-KR") : "—";
}

export function PromotionAdminTable({
  promotions,
}: {
  promotions: PromotionRow[];
}) {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: "var(--chayong-divider)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--chayong-surface)" }}>
            {["매물", "판매자", "상품", "금액", "상태", "노출 기간", "결제일"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-medium"
                  style={{ color: "var(--chayong-text-sub)" }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-10"
                style={{ color: "var(--chayong-text-caption)" }}
              >
                프로모션 내역이 없습니다.
              </td>
            </tr>
          ) : (
            promotions.map((row, i) => {
              const colors = STATUS_COLORS[row.status] ?? STATUS_COLORS.PENDING;
              return (
                <tr
                  key={row.id}
                  style={{
                    borderTop:
                      i > 0 ? `1px solid var(--chayong-divider)` : undefined,
                    backgroundColor: "var(--chayong-bg)",
                  }}
                >
                  <td className="px-4 py-3" style={{ color: "var(--chayong-text)" }}>
                    {row.listing.brand && row.listing.model
                      ? `${row.listing.brand} ${row.listing.model}`
                      : "정보 미입력"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--chayong-text)" }}>
                    {row.seller.name ?? row.seller.email}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--chayong-text)" }}>
                    {TIER_LABELS[row.tier] ?? row.tier} · {row.durationDays}일
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--chayong-text)" }}
                  >
                    {row.amount.toLocaleString("ko-KR")}원
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: colors.bg, color: colors.color }}
                    >
                      {STATUS_LABELS[row.status] ?? row.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--chayong-text-caption)" }}
                  >
                    {row.startsAt
                      ? `${fmtDate(row.startsAt)} ~ ${fmtDate(row.expiresAt)}`
                      : "—"}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--chayong-text-caption)" }}
                  >
                    {fmtDate(row.paidAt)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
