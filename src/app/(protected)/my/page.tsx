import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/auth";
import { prisma } from "@/lib/db/prisma";
import { MyDashboard } from "@/features/my/components/my-dashboard";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 매물, 찜한 매물, 거래 내역을 확인하세요.",
};

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [listingCount, chatCount, activeTransactionCount, myListings] =
    await Promise.all([
      prisma.listing.count({ where: { sellerId: profile.id } }),
      prisma.chatRoom.count({
        where: {
          isActive: true,
          OR: [{ buyerId: profile.id }, { sellerId: profile.id }],
        },
      }),
      prisma.escrowPayment.count({
        where: {
          status: { in: ["PENDING", "PAID"] },
          OR: [{ buyerId: profile.id }, { sellerId: profile.id }],
        },
      }),
      prisma.listing.findMany({
        where: { sellerId: profile.id },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          monthlyPayment: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <MyDashboard
      profile={{
        name: profile.name ?? "",
        role: profile.role,
        listingCount,
        chatCount,
        activeTransactionCount,
      }}
      myListings={myListings}
    />
  );
}
