"use client";

import { useAuthStore } from "../../shared/infrastructure/store/authStore";
import { calculateCompatibilityScore } from "../../shared/domain/Dog";
import type { Adoptante } from "../../shared/domain/User";

interface Props {
  dogVector: [number, number, number, number] | null | undefined;
  adoptionSpeed: number | null;
}

export default function CompatibilityChip({ dogVector, adoptionSpeed }: Props) {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== "applicant") return null;

  const userVector = (user as Adoptante).userVector;
  const score = calculateCompatibilityScore(
    userVector,
    dogVector,
    adoptionSpeed,
  );

  if (score === null) return null;

  const colorCls =
    score >= 75
      ? "dp-compat--high"
      : score >= 50
        ? "dp-compat--mid"
        : "dp-compat--low";

  return (
    <span className={`dp-compat ${colorCls}`}>
      <span className="material-symbols-outlined dp-compat__icon">
        favorite
      </span>
      {score}% compatibilidad
    </span>
  );
}
