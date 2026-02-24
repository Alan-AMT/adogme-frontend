// app/login/page.tsx
import LoginPage from "@/modules/auth/components/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | Adogme",
  description: "Accede a tu cuenta en Adogme - Adopción Responsable en la GAM",
};

export default function LoginRoute() {
  return <LoginPage />;
}
