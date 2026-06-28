import { prisma } from "@/lib/db/prisma";
import type { Profile } from "@prisma/client";

export type OAuthProvider = "google" | "kakao";

export type OAuthProfileInput = {
  userId: string;
  email: string;
  name: string | null;
  provider: OAuthProvider;
};

export type OAuthProfileResult =
  | { status: "created"; profile: Profile; needsConsent: true }
  | { status: "ok"; profile: Profile; needsConsent: boolean }
  | { status: "conflict"; profile: null; needsConsent: false };

export async function resolveOAuthProfile(
  input: OAuthProfileInput,
): Promise<OAuthProfileResult> {
  const existing = await prisma.profile.findUnique({ where: { id: input.userId } });

  if (!existing) {
    const profile = await prisma.profile.create({
      data: {
        id: input.userId,
        email: input.email,
        name: input.name,
        role: "BUYER",
        authProvider: input.provider,
      },
    });
    return { status: "created", profile, needsConsent: true };
  }

  // DB 트리거(handle_new_user)가 auth.users INSERT 시 profile을 auth_provider=NULL로
  // 선생성한다. 이 stub을 흡수(provider 채움)하지 않으면 NULL !== provider로 conflict가
  // 떠 소셜 첫 로그인이 항상 막힌다. 트리거가 없으면 existing 자체가 없어 이 분기는 무해.
  if (existing.authProvider == null) {
    const profile = await prisma.profile.update({
      where: { id: input.userId },
      data: {
        authProvider: input.provider,
        ...(existing.name == null ? { name: input.name } : {}),
      },
    });
    const needsConsent =
      profile.termsAcceptedAt == null || profile.privacyAcceptedAt == null;
    return { status: "ok", profile, needsConsent };
  }

  if (existing.authProvider !== input.provider) {
    return { status: "conflict", profile: null, needsConsent: false };
  }

  const needsConsent =
    existing.termsAcceptedAt == null || existing.privacyAcceptedAt == null;

  return { status: "ok", profile: existing, needsConsent };
}
