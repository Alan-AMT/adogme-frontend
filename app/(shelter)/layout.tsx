// app/(shelter)/layout.tsx
// SERVER COMPONENT — verifica sesión y rol antes de renderizar el portal del refugio.
// Guards en orden:
//   1. Sin sesión          → /login
//   2. Rol incorrecto      → /
//   3. Refugio rechazado   → /login?error=rejected
//   4. Refugio suspendido  → /login?error=suspended
//   5. Refugio no aprobado → /refugio/pendiente
//
// Si el shelter-session cookie no está presente (expiró o el enrichment falló),
// se hace un fetch server-side para obtener el status real del refugio.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/modules/shared/infrastructure/session";
import { ShelterPortalLayout } from "@/modules/shelter/components/ShelterPortalLayout";

type ShelterStatus = "pending" | "approved" | "rejected" | "suspended";

async function resolveShelterStatus(
  userId: string,
  token: string,
): Promise<ShelterStatus | undefined> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "";
    const res = await fetch(`${base}/shelters-ms/shelter/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const shelter = await res.json();
    return (shelter.status ?? shelter.shelterStatus) as ShelterStatus | undefined;
  } catch {
    return undefined;
  }
}

export default async function ShelterGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) redirect("/login");
  if (session.role !== "shelter") redirect("/");
  if (session.shelterStatus === "rejected") redirect("/login?error=rejected");
  if (session.shelterStatus === "suspended") redirect("/login?error=suspended");

  let shelterStatus: ShelterStatus | undefined = session.shelterStatus as ShelterStatus | undefined;

  if (!shelterStatus) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value ?? "";
    shelterStatus = await resolveShelterStatus(session.id, token);
  }

  if (shelterStatus === "rejected") redirect("/login?error=rejected");
  if (shelterStatus === "suspended") redirect("/login?error=suspended");
  if (shelterStatus !== "approved") redirect("/refugio/pendiente");

  return <ShelterPortalLayout>{children}</ShelterPortalLayout>;
}
