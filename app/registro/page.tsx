// app/registro/page.tsx
import RegisterPage from "@/modules/auth/components/RegisterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse | Adogme",
  description: "Crea tu cuenta en Adogme y comienza tu proceso de adopción responsable",
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
