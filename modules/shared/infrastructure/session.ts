// modules/shared/infrastructure/session.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-side session reading for Next.js App Router layouts.
// (shelter), (applicant), and (admin) layouts call getAuthSession()
// to verify auth and role BEFORE rendering the page.
//
// DO NOT use in Client Components — use useAuth() hook instead.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import type { Administrador, Adoptante, ShelterUser, User } from "../domain/User";

// ─── Session type ────────────────────────────────────────────────────────────

export interface SessionData {
  userId: number;
  email: string;
  role: User["role"];
  shelterStatus?: ShelterUser["shelterStatus"];
  shelterId?: number;
  name: string;
  avatarUrl?: string;
  exp: number;
}

// ─── Main function ───────────────────────────────────────────────────────────

export async function getAuthSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  try {
    return decodeSessionToken(token);
  } catch {
    return null;
  }
}

// ─── Role helpers (for layouts) ──────────────────────────────────────────────

export async function requireAuth(): Promise<SessionData> {
  const session = await getAuthSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  return session;
}

export async function requireRole(role: User["role"]): Promise<SessionData> {
  const session = await getAuthSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  if (session.role !== role) throw new Error("FORBIDDEN");
  return session;
}

// ─── Token decoder ───────────────────────────────────────────────────────────

function decodeSessionToken(token: string): SessionData | null {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

  if (useMock) {
    return decodeMockToken(token);
  }

  return decodeProdToken(token);
}

function decodeMockToken(token: string): SessionData | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return payload as SessionData;
  } catch {
    return null;
  }
}

function decodeProdToken(token: string): SessionData | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000))
      return null;

    return payload as SessionData;
  } catch {
    return null;
  }
}

// ─── Mock token builder (server-side, uses Buffer) ───────────────────────────

export function createMockToken(
  user: Adoptante | ShelterUser | Administrador,
): string {
  const session: SessionData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    ...(user.role === "shelter" && {
      shelterId: (user as ShelterUser).shelterId,
      shelterStatus: (user as ShelterUser).shelterStatus,
    }),
  };
  return Buffer.from(JSON.stringify(session)).toString("base64");
}
