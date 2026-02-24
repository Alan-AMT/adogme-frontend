import ForgotPasswordForm from "@/modules/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Recuperar Contraseña | Adogme",
};

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <div className="auth-left">
        <ForgotPasswordForm />
      </div>
      {/* Puedes omitir la columna derecha en esta vista para que sea más limpia */}
    </main>
  );
}
