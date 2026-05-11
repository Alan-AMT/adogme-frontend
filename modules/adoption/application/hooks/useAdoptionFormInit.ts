// modules/adoption/application/hooks/useAdoptionFormInit.ts
// Flujo de inicialización al entrar al formulario de adopción:
//   1. Verifica que el applicant NO tenga ya una solicitud para este perro.
//      - Si existe → toast + redirect a /perros.
//   2. Si no hay draft local, fetchea el formData de la solicitud más reciente
//      del applicant y lo aplica como prefill, lanzando un toast amistoso.
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { AdoptionFormData } from "../../../shared/domain/AdoptionRequest";
import type { Adoptante } from "../../../shared/domain/User";
import { useAuthStore } from "../../../shared/infrastructure/store/authStore";
import { adoptionService } from "../../infrastructure/AdoptionServiceFactory";
import { sanitizeFormData } from "../../domain/sanitizeFormData";

export interface UseAdoptionFormInitOptions {
  perroId: string;
  hadInitialDraft: boolean;
  onPrefill: (data: Partial<AdoptionFormData>) => void;
}

export interface UseAdoptionFormInitReturn {
  isInitializing: boolean;
}

export function useAdoptionFormInit({
  perroId,
  hadInitialDraft,
  onPrefill,
}: UseAdoptionFormInitOptions): UseAdoptionFormInitReturn {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const applicantId =
    user?.role === "applicant" ? (user as Adoptante).applicantId : undefined;

  const [isInitializing, setIsInitializing] = useState(true);

  // Guard contra ejecuciones repetidas (StrictMode + cambios benignos de deps).
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    if (!user) return; // esperar a que el authStore hidrate

    if (!applicantId) {
      // Usuario presente pero sin applicantId (estado raro) — no bloqueamos
      // la UI; el submit ya valida y muestra error si hace falta.
      ranRef.current = true;
      setIsInitializing(false);
      return;
    }

    ranRef.current = true;

    // Nota: no usamos un flag `cancelled` + cleanup porque el guard `ranRef`
    // ya impide ejecuciones duplicadas. En React StrictMode (dev) la cleanup
    // del primer efecto correría inmediatamente, abortando la única ejecución
    // viva (la segunda ya bailaría por el guard) y dejando el loader colgado.
    (async () => {
      try {
        const check = await adoptionService.checkNotExistingRequest(
          perroId,
          applicantId,
        );

        if (check.exists) {
          toast.warning(
            "Ya tienes una solicitud existente para este perro, no puedes crear otra",
            { duration: 5000 },
          );
          router.replace("/perros");
          return;
        }

        if (!hadInitialDraft) {
          const recent = await adoptionService.getRecentFormData(applicantId);
          if (recent) {
            const cleaned = sanitizeFormData(recent);
            if (Object.keys(cleaned).length > 0) {
              onPrefill(cleaned);
              toast.success(
                "Hemos recopilado los datos de tu última solicitud para agilizar el proceso",
                { duration: 4000 },
              );
            }
          }
        }
      } catch (err) {
        // No bloqueamos el flujo si falla el prefill — el usuario puede
        // llenar el formulario manualmente.
        console.error("[useAdoptionFormInit]", err);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [user, applicantId, perroId, hadInitialDraft, onPrefill, router]);

  return { isInitializing };
}
