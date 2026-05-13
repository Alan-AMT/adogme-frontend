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

// ─── x-apigateway-api-userinfo header ─────────────────────────────────────────
// En producción, el GCP API Gateway valida el JWT y le inyecta a los MS internos
// este header con el payload del user codificado en Base64URL. En local sin
// gateway, lo simulamos para que los guards del BE funcionen igual.

function toBase64Url(input: string): string {
  // btoa solo acepta latin-1, así que codificamos UTF-8 a bytes primero.
  const utf8Bytes = new TextEncoder().encode(input);
  let binary = "";
  utf8Bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildUserInfoHeader(user: { id: string; role: string; name?: string; email?: string }): string {
  const payload = {
    id:    user.id,
    role:  user.role,
    name:  user.name ?? "",
    email: user.email ?? "",
  };
  return toBase64Url(JSON.stringify(payload));
}

// ─── Shelter enrichment ───────────────────────────────────────────────────────

async function enrichShelterUser(user: ShelterUser): Promise<ShelterUser> {
  const res = await fetch(API_ENDPOINTS.SHELTERS.BY_OWNER(user.id), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      Authorization: `Bearer ${window.__authToken}`,
      "x-apigateway-api-userinfo": buildUserInfoHeader(user),
    },
  });

  if (!res.ok) throw new Error(`Shelter fetch failed: ${res.status}`);

  const shelter = await res.json();

  const shelterId: string = shelter.id ?? shelter.shelterId;
  const shelterStatus: string = shelter.status ?? shelter.shelterStatus;
  const shelterName: string = shelter.name ?? shelter.shelterName;
  const shelterLogo: string | undefined = shelter.logo ?? shelter.shelterLogo;
  const shelterAdoptionFee: number = shelter.adoptionFee ?? 0;

  // Persist to cookie so server layouts can read it
  setShelterSessionCookie({ shelterId, shelterStatus });

  // Persist to Web Storage API for fast hydration on refresh
  setShelterProfileCache(user.id, {
    shelterName,
    shelterLogo,
    shelterAdoptionFee,
  });

  return {
    ...user,
    shelterId,
    shelterStatus: shelterStatus as ShelterUser["shelterStatus"],
    shelterName,
    shelterLogo,
    shelterAdoptionFee,
  };
}

// ─── Applicant enrichment ─────────────────────────────────────────────────────

async function enrichApplicant(user: Adoptante): Promise<Adoptante> {
  const res = await fetch(API_ENDPOINTS.APPLICANTS.ME, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      Authorization: `Bearer ${window.__authToken}`,
      "x-apigateway-api-userinfo": buildUserInfoHeader(user),
    },
  });

  if (!res.ok) throw new Error(`Auth me fetch failed: ${res.status}`);

  const profile = await res.json();

  const phone: string | undefined = profile.phone;
  const address: string | undefined = profile.address;
  const applicantId: string = profile.id;
  const postalCode: string | undefined = profile.address;
  const avatarUrl: string | undefined = profile.avatarUrl ?? profile.avatar;
  // applicants-ms puede devolver el userVector en el campo `vector` o `userVector`.
  // Lo tratamos como "no hizo el quiz" cuando:
  //   - no es array de 4 números, o
  //   - todos los valores son 0 (vector default del backend para usuarios nuevos),
  //   - tiene NaN/Infinity.
  // Solo un vector con valores reales y no-todos-cero significa "quiz hecho".
  const userVectorRaw = profile.vector ?? profile.userVector ?? null;
  const isValidVector =
    Array.isArray(userVectorRaw) &&
    userVectorRaw.length === 4 &&
    userVectorRaw.every(v => typeof v === "number" && Number.isFinite(v)) &&
    !userVectorRaw.every(v => v === 0);
  const userVector = isValidVector
    ? (userVectorRaw as [number, number, number, number])
    : null;
  const favoriteDogs: string[] = Array.isArray(profile.favoriteDogs)
    ? profile.favoriteDogs
    : [];

  // Persist to Web Storage API for fast hydration on refresh
  setUserProfileCache(user.id, {
    phone,
    address,
    avatarUrl,
    applicantId,
    postalCode,
    userVector,
    favoriteDogs,
  });

  return { ...user, phone, address, avatarUrl, applicantId, postalCode, userVector, favoriteDogs };
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
    console.warn(
      "[enrichUser] Enrichment failed, continuing in degraded mode:",
      err,
    );
  }

  return user;
}
