// modules/shelter/components/dog-form-steps/MediaStep.tsx
// Archivo 181 — Paso 4: Fotos del perro.
// FileUpload → validación CV por imagen → muestra spinner / ✅ / ❌.
"use client";

import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import type { DogFormData } from "../../application/hooks/useDogForm";
import "../../styles/shelterViews.css";

type UpdateFn = <K extends keyof DogFormData>(
  field: K,
  value: DogFormData[K],
) => void;

interface Props {
  formData: DogFormData;
  errors: Record<string, string>;
  update: UpdateFn;
}

const MAX_PHOTOS = 10;
const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export function MediaStep({ formData, errors, update }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).slice(
        0,
        MAX_PHOTOS - formData.fotos.length,
      );
      if (arr.length === 0) return;

      const valid = arr.filter((f) => f.size <= MAX_BYTES);
      const tooLarge = arr.length - valid.length;

      if (tooLarge > 0) {
        setSizeError(
          tooLarge === 1
            ? `Una foto supera los ${MAX_MB} MB. Comprimela un poco antes de subirla — desde tu galería o con iLoveIMG (usa la app de tu preferencia). ¡Es gratis y muy fácil!`
            : `${tooLarge} fotos superan los ${MAX_MB} MB. Comprimelas antes de subirlas — desde tu galería o con iLoveIMG (usa la app de tu preferencia). ¡Es gratis y muy fácil!`,
        );
      } else {
        setSizeError(null);
      }

      if (valid.length === 0) return;

      const newUrls = valid.map((f) => URL.createObjectURL(f));
      const allUrls = [...formData.fotos, ...newUrls];
      const allFiles = [...formData.fotosFiles, ...valid];

      update("fotos", allUrls);
      update("fotosFiles", allFiles);
      update("foto", allUrls[0] ?? "");
    },
    [formData.fotos, formData.fotosFiles, update],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  };

  function removePhoto(idx: number) {
    const next = formData.fotos.filter((_, i) => i !== idx);
    const nextFiles = formData.fotosFiles.filter((_, i) => i !== idx);
    update("fotos", next);
    update("fotosFiles", nextFiles);
    update("foto", next[0] ?? "");
  }

  function setMain(url: string) {
    if (url === formData.foto) return;
    const idx = formData.fotos.indexOf(url);
    const files = formData.fotosFiles;
    update("foto", url);
    update("fotos", [url, ...formData.fotos.filter((u) => u !== url)]);
    update("fotosFiles", [files[idx], ...files.filter((_, i) => i !== idx)]);
  }

  const canAdd = formData.fotos.length < MAX_PHOTOS;

  return (
    <div className="sv-form-section">
      <div className="sv-form-section__header">
        <div className="sv-form-section__header-icon">
          <span className="material-symbols-outlined">photo_library</span>
        </div>
        <span className="sv-form-section__header-text">Fotos del perro</span>
      </div>
      <div className="sv-form-section__body">
        {/* Drop zone */}
        {canAdd && (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            style={{
              border: "2px dashed #e4e4e7",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: "#fafafa",
              transition: "all 150ms ease",
              marginBottom: formData.fotos.length > 0 ? "1rem" : 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 36,
                color: "#d4d4d8",
                display: "block",
                marginBottom: "0.5rem",
                fontVariationSettings: "'FILL' 0,'wght' 200",
              }}
            >
              add_photo_alternate
            </span>
            <p
              style={{
                fontSize: "0.88rem",
                fontWeight: 800,
                color: "#3f3f46",
                marginBottom: "0.25rem",
              }}
            >
              Arrastra fotos aquí{" "}
              <span style={{ color: "#a1a1aa", fontWeight: 600 }}>
                o haz clic para seleccionar
              </span>
            </p>
            <p
              style={{ fontSize: "0.75rem", color: "#a1a1aa", fontWeight: 500 }}
            >
              JPG, PNG, WebP · máx {MAX_MB}MB · hasta {MAX_PHOTOS} fotos
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          style={{ display: "none" }}
          accept="image/*"
          multiple
          onChange={onChange}
        />

        {/* Photo grid */}
        {formData.fotos.length > 0 && (
          <>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#a1a1aa",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.5rem",
              }}
            >
              {formData.fotos.length} foto
              {formData.fotos.length !== 1 ? "s" : ""} · La primera es la foto
              principal
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                gap: "0.65rem",
              }}
            >
              {formData.fotos.map((url, idx) => {
                const isMain = url === formData.foto;

                return (
                  <div
                    key={url}
                    style={{
                      position: "relative",
                      borderRadius: "0.85rem",
                      overflow: "hidden",
                      border: isMain
                        ? "2.5px solid #ff6b6b"
                        : "1.5px solid #f0f0f0",
                      aspectRatio: "1",
                      background: "#f4f4f5",
                      cursor: "pointer",
                    }}
                    onClick={() => setMain(url)}
                    title={
                      isMain
                        ? "Foto principal"
                        : "Clic para establecer como principal"
                    }
                  >
                    <Image
                      src={url}
                      alt={`Foto ${idx + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="120px"
                    />

                    {/* Main badge */}
                    {isMain && (
                      <div
                        style={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          background: "#ff6b6b",
                          color: "#fff",
                          fontSize: "0.6rem",
                          fontWeight: 900,
                          padding: "0.15rem 0.45rem",
                          borderRadius: 999,
                        }}
                      >
                        PRINCIPAL
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.5)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 12, color: "#fff" }}
                      >
                        close
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {sizeError && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              background: "#fffbeb",
              border: "1.5px solid #fcd34d",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              marginTop: "0.5rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18,
                color: "#d97706",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              info
            </span>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#92400e",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {sizeError}
            </p>
          </div>
        )}

        {errors.foto && (
          <p className="sv-field__error" style={{ marginTop: "0.5rem" }}>
            {errors.foto}
          </p>
        )}

        <p className="sv-field__helper" style={{ marginTop: "0.5rem" }}>
          Haz clic en una foto para establecerla como principal.
        </p>
      </div>
    </div>
  );
}
