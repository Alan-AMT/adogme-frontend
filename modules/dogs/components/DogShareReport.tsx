// modules/dogs/components/DogShareReport.tsx
// Botones "Compartir" y "Reportar" — client component (requiere window)
"use client";

import { useState } from "react";

interface Props {
  nombre: string;
}

export default function DogShareReport({ nombre }: Props) {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Adopta a ${nombre} — aDOGme`, url });
      } catch {
        // usuario canceló — no hacer nada
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleReport() {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  }

  return (
    <div className="dp-secondary-actions">
      <button className="dp-action-btn" onClick={handleShare}>
        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
          {copied ? "check_circle" : "share"}
        </span>
        {copied ? "¡Copiado!" : "Compartir"}
      </button>
      <button
        className="dp-action-btn dp-action-btn--danger"
        onClick={handleReport}
        disabled={reported}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
          {reported ? "check" : "flag"}
        </span>
        {reported ? "Reportado" : "Reportar"}
      </button>
    </div>
  );
}
