"use client";

import Link from "next/link";
import { useEffect } from "react";

// Si ya tienes tu Button en shared, úsalo.
// Si aún no lo tienes, puedes reemplazarlo por un <button> normal.
import { Button } from "@/modules/shared/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log en consola (y después aquí integrarías Sentry/LogRocket, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-zinc-900">Algo salió mal</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Ocurrió un error inesperado. Puedes intentar recargar esta vista o volver al inicio.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" onClick={reset} fullWidth>
            Intentar de nuevo
          </Button>

          <Link href="/" className="w-full">
            <Button variant="secondary" fullWidth>
              Volver al inicio
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-6 max-h-52 overflow-auto rounded-xl bg-zinc-950 p-3 text-xs text-zinc-100">
            {String(error?.message ?? error)}
          </pre>
        )}
      </div>
    </div>
  );
}
