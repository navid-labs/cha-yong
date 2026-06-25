import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  // 이메일 가입자 포함, 약관·개인정보 동의 전에는 보호 영역 진입을 차단한다.
  if (!profile.termsAcceptedAt || !profile.privacyAcceptedAt) {
    redirect("/onboarding/consent");
  }
  return <>{children}</>;
}
