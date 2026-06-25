import { describe, it, expect, vi, beforeEach } from "vitest";

const getUser = vi.fn();
const getSession = vi.fn();
const findUnique = vi.fn();

vi.mock("./server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser, getSession },
  })),
}));
vi.mock("@/lib/db/prisma", () => ({
  prisma: { profile: { findUnique: (...a: unknown[]) => findUnique(...a) } },
}));

import { getUser as getAuthUser, getProfile } from "./auth";

describe("auth helpers verify the JWT via getUser (not getSession)", () => {
  beforeEach(() => {
    getUser.mockReset();
    getSession.mockReset();
    findUnique.mockReset();
  });

  it("getUser() returns the verified user and never reads the unverified session", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const user = await getAuthUser();
    expect(user).toEqual({ id: "u1" });
    expect(getUser).toHaveBeenCalled();
    expect(getSession).not.toHaveBeenCalled();
  });

  it("getUser() returns null when there is no verified user", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    expect(await getAuthUser()).toBeNull();
  });

  it("getProfile() loads the profile for the verified user", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    findUnique.mockResolvedValue({ id: "u1", role: "BUYER" });
    const profile = await getProfile();
    expect(findUnique).toHaveBeenCalledWith({ where: { id: "u1" } });
    expect(profile).toEqual({ id: "u1", role: "BUYER" });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("getProfile() returns null without a verified user", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    expect(await getProfile()).toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });
});
