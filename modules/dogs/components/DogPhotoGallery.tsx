"use client";

import { useState } from "react";
import Image from "next/image";
import type { DogImage } from "../../shared/domain/Dog";

interface Props {
  fotos: DogImage[];
  fallbackFoto?: string;
  nombre: string;
}

export default function DogPhotoGallery({
  fotos,
  fallbackFoto,
  nombre,
}: Props) {
  const accepted = fotos.filter((f) => f.status === "accepted");
  const urls =
    accepted.length > 0
      ? accepted.map((f) => f.url)
      : [fallbackFoto || "/assets/dogs/dog1.jpg"];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeUrl = urls[activeIdx] ?? urls[0];

  return (
    <div className="dp-gallery">
      <div className="dp-photo-frame">
        <div className="dp-photo-panel">
          <div className="dp-photo-inner">
            <Image
              src={activeUrl}
              alt={`Foto de ${nombre}`}
              fill
              className="dp-photo-img"
              sizes="340px"
              priority
            />
          </div>
        </div>
      </div>

      {urls.length > 1 && (
        <div
          className="dp-thumbs"
          aria-label={`Galería de fotos de ${nombre}`}
        >
          {urls.map((url, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Mostrar foto ${i + 1} de ${urls.length}`}
                aria-current={isActive ? "true" : undefined}
                className={`dp-thumb${isActive ? " dp-thumb--active" : ""}`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="dp-thumb__img"
                  sizes="64px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
