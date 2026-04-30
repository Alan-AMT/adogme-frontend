// app/(shelter)/layout.tsx
// SERVER COMPONENT — verifica sesión y rol antes de renderizar el portal del refugio.
// Guards en orden:
//   1. Sin sesión          → /login
//   2. Rol incorrecto      → /
//   3. Refugio pendiente   → /refugio/pendiente
//   4. Refugio rechazado   → /login?error=rejected
//   5. Refugio suspendido  → /login?error=suspended
import { redirect } from "next/navigation";
import { getAuthSession } from "@/modules/shared/infrastructure/session";
import { ShelterPortalLayout } from "@/modules/shelter/components/ShelterPortalLayout";

export default async function ShelterGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) redirect("/login");
  if (session.role !== "shelter") redirect("/");
  if (session.shelterStatus === "pending") redirect("/refugio/pendiente");
  if (session.shelterStatus === "rejected") redirect("/login?error=rejected");
  if (session.shelterStatus === "suspended") redirect("/login?error=suspended");

  return <ShelterPortalLayout>{children}</ShelterPortalLayout>;
}
