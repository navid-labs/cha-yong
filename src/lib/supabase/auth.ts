import { createClient } from "./server";

/**
 * Returns the JWT-verified Supabase user from server context, or null.
 *
 * Uses `getUser()` (revalidates the token against the Auth server) instead of
 * the unverified session cookie, so a tampered/expired cookie cannot pass auth.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the Profile record for the currently authenticated user.
 * Returns null if not authenticated or no profile found.
 */
export async function getProfile() {
  const user = await getUser();
  if (!user) return null;

  const { prisma } = await import("@/lib/db/prisma");
  return prisma.profile.findUnique({ where: { id: user.id } });
}
