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
  const [carouselIdx, setCarouselIdx] = useState<number | null>(null);

  return (
    <div className="dp-gallery">
      <div className="dp-photo-frame">
        <div className="dp-photo-panel">
          <div
            className="dp-photo-inner"
            onClick={() => setCarouselIdx(activeIdx)}
            style={{ cursor: "zoom-in" }}
          >
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

      {carouselIdx !== null && (
        <div
          onClick={() => setCarouselIdx(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {urls.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCarouselIdx((i) =>
                  i !== null ? (i - 1 + urls.length) % urls.length : null
                );
              }}
              style={{
                position: "absolute",
                left: 16,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urls[carouselIdx]}
            alt={`Foto de ${nombre} ${carouselIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "0.75rem",
            }}
          />

          {urls.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCarouselIdx((i) => (i !== null ? (i + 1) % urls.length : null));
              }}
              style={{
                position: "absolute",
                right: 16,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}

          <button
            onClick={() => setCarouselIdx(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              color: "#fff",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {urls.length > 1 && (
            <p
              style={{
                position: "absolute",
                bottom: 20,
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {carouselIdx + 1} / {urls.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
