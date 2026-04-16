// modules/shared/infrastructure/auth/enrichUser.ts
// ─────────────────────────────────────────────────────────────────────────────
// Role-aware post-login enrichment.
// Called once after login/register to fetch role-specific data,
// persist it to storage, and return an enriched user object.
// Fails silently — if the fetch fails the original user is returned unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import type { AuthUser } from "../store/authStore";
import type { Adoptante, ShelterUser } from "../../domain/User";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  setShelterSessionCookie,
  setShelterProfileCache,
  setUserProfileCache,
} from "./tokenManager";

// ─── Shelter enrichment ───────────────────────────────────────────────────────

async function enrichShelterUser(user: ShelterUser): Promise<ShelterUser> {
  const res = await fetch(API_ENDPOINTS.SHELTERS.BY_OWNER(user.id), {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Shelter fetch failed: ${res.status}`);

  const shelter = await res.json();

  const shelterId: string = shelter.id ?? shelter.shelterId;
  const shelterStatus: string = shelter.status ?? shelter.shelterStatus;
  const shelterName: string = shelter.name ?? shelter.shelterName;
  const shelterLogo: string | undefined = shelter.logo ?? shelter.shelterLogo;

  // Persist to cookie so server layouts can read it
  setShelterSessionCookie({ shelterId, shelterStatus });

  // Persist to Web Storage API for fast hydration on refresh
  setShelterProfileCache(user.id, { shelterName, shelterLogo });

  return {
    ...user,
    shelterId,
    shelterStatus: shelterStatus as ShelterUser["shelterStatus"],
    shelterName,
    shelterLogo,
  };
}

// ─── Applicant enrichment ─────────────────────────────────────────────────────

async function enrichApplicant(user: Adoptante): Promise<Adoptante> {
  const res = await fetch(API_ENDPOINTS.AUTH.ME, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Auth me fetch failed: ${res.status}`);

  const profile = await res.json();

  const phone: string | undefined = profile.phone;
  const address: string | undefined = profile.address;
  const avatarUrl: string | undefined = profile.avatarUrl ?? profile.avatar;

  // Persist to Web Storage API for fast hydration on refresh
  setUserProfileCache(user.id, { phone, address, avatarUrl });

  return { ...user, phone, address, avatarUrl };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function enrichUser(user: AuthUser): Promise<AuthUser> {
  try {
    if (user.role === "shelter") {
      return await enrichShelterUser(user as ShelterUser);
    }

    if (user.role === "applicant") {
      return await enrichApplicant(user as Adoptante);
    }
  } catch (err) {
    console.warn("[enrichUser] Enrichment failed, continuing in degraded mode:", err);
  }

  return user;
}
