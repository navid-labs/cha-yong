import type { UserRole } from "@prisma/client";

type EscrowParticipants = {
  buyerId: string;
  sellerId: string;
};

type EscrowViewer = {
  id: string;
  role: UserRole;
};

/**
 * 에스크로 거래 내역(명의변경 증빙 signed URL 포함)을 조회할 권한이 있는지 판정한다.
 * 거래 당사자(구매자·판매자)와 관리자만 허용하고, 무관한 유저에게는 존재 자체를 노출하지 않는다.
 */
export function canViewEscrow(
  viewer: EscrowViewer,
  escrow: EscrowParticipants
): boolean {
  return (
    escrow.buyerId === viewer.id ||
    escrow.sellerId === viewer.id ||
    viewer.role === "ADMIN"
  );
}
