// modules/shelter/components/dog-form-steps/MedicalStep.tsx
// Archivo 180 — Paso 3: Historial médico.
// Campos: salud (texto libre), vacunas (tabla add/remove).
"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DogFormData } from "../../application/hooks/useDogForm";
import type { Vaccination } from "@/modules/shared/domain/Dog";
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

let _nextId = 100; // local incrementer for new vaccine IDs

function emptyVac(): Vaccination {
  return {
    id: String(_nextId++),
    nombre: "",
    fecha: "",
    proximaDosis: "",
    verificada: false,
  };
}

export function MedicalStep({ formData, errors, update }: Props) {
  const [newVac, setNewVac] = useState<Vaccination>(emptyVac);

  function addVaccine() {
    if (!newVac.nombre.trim() || !newVac.fecha) return;
    update("vacunas", [...formData.vacunas, { ...newVac }]);
    setNewVac(emptyVac());
  }

  function removeVaccine(id: string) {
    update(
      "vacunas",
      formData.vacunas.filter((v) => v.id !== id),
    );
  }

  function updateNewVac<K extends keyof Vaccination>(
    key: K,
    val: Vaccination[K],
  ) {
    setNewVac((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <>
      {/* ── Salud general ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">favorite</span>
          </div>
          <span className="sv-form-section__header-text">Salud general</span>
        </div>
        <div className="sv-form-section__body">
          {/* Vacunado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 0",
              borderBottom: "1px solid #f4f4f5",
            }}
          >
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#374151",
                cursor: "pointer",
              }}
              htmlFor="check-vacunado"
            >
              Vacunado
            </label>
            <input
              id="check-vacunado"
              type="checkbox"
              defaultChecked={formData.estaVacunado}
              // value={formData.estaDesparasitado}
              onChange={(e) => update("estaVacunado", e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: "#ff6b6b",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Desparasitado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 0",
              borderBottom: "1px solid #f4f4f5",
              marginBottom: "1rem",
            }}
          >
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#374151",
                cursor: "pointer",
              }}
              htmlFor="check-desparasitado"
            >
              Desparasitado
            </label>
            <input
              id="check-desparasitado"
              type="checkbox"
              checked={formData.estaDesparasitado}
              onChange={(e) => update("estaDesparasitado", e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: "#ff6b6b",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Salud */}
          <div className="sv-field">
            <label className="sv-field__label">Estado de salud</label>
            <select
              className="sv-field__select"
              value={formData.salud}
              onChange={(e) => update("salud", e.target.value)}
            >
              <option value="Sano">Sano</option>
              <option value="Lesión o condición leve">
                Lesión o condición leve
              </option>
              <option value="Lesión o condición grave">
                Lesión o condición grave
              </option>
            </select>
          </div>

          {/* Pelaje */}
          <div className="sv-field">
            <label className="sv-field__label">Tipo de pelaje</label>
            <select
              className="sv-field__select"
              value={formData.largoPelaje}
              onChange={(e) =>
                update(
                  "largoPelaje",
                  e.target.value as "corto" | "mediano" | "largo",
                )
              }
            >
              <option value="corto">Corto</option>
              <option value="mediano">Mediano</option>
              <option value="largo">Largo</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Registro de vacunas ── */}
      <div className="sv-form-section">
        <div className="sv-form-section__header">
          <div className="sv-form-section__header-icon">
            <span className="material-symbols-outlined">vaccines</span>
          </div>
          <span className="sv-form-section__header-text">
            Registro de vacunas
          </span>
        </div>
        <div className="sv-form-section__body">
          {/* Vacunas existentes */}
          {formData.vacunas.length > 0 ? (
            <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.82rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#fafafa",
                      borderBottom: "1px solid #f4f4f5",
                    }}
                  >
                    {["Vacuna", "Fecha", "Próx. dosis", "Verificada", ""].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0.55rem 0.85rem",
                            fontWeight: 900,
                            color: "#a1a1aa",
                            textAlign: "left",
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {formData.vacunas.map((vac) => (
                    <tr
                      key={vac.id}
                      style={{ borderBottom: "1px solid #f9fafb" }}
                    >
                      <td
                        style={{
                          padding: "0.65rem 0.85rem",
                          fontWeight: 700,
                          color: "#18181b",
                        }}
                      >
                        {vac.nombre}
                      </td>
                      <td
                        style={{ padding: "0.65rem 0.85rem", color: "#52525b" }}
                      >
                        {vac.fecha}
                      </td>
                      <td
                        style={{ padding: "0.65rem 0.85rem", color: "#71717a" }}
                      >
                        {vac.proximaDosis || "—"}
                      </td>
                      <td style={{ padding: "0.65rem 0.85rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            fontSize: "0.72rem",
                            fontWeight: 900,
                            borderRadius: 999,
                            padding: "0.2rem 0.6rem",
                            background: vac.verificada ? "#dcfce7" : "#f4f4f5",
                            color: vac.verificada ? "#166534" : "#71717a",
                          }}
                        >
                          {vac.verificada ? "✓ Verificada" : "Pendiente"}
                        </span>
                      </td>
                      <td style={{ padding: "0.65rem 0.85rem" }}>
                        <button
                          type="button"
                          onClick={() => removeVaccine(vac.id)}
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "0.5rem",
                            width: 28,
                            height: 28,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 14 }}
                          >
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p
              style={{
                fontSize: "0.82rem",
                color: "#a1a1aa",
                fontWeight: 500,
                marginBottom: "1rem",
              }}
            >
              Aún no has registrado vacunas para este perro.
            </p>
          )}

          {/* Formulario agregar vacuna */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "0.9rem",
              padding: "1rem",
              border: "1.5px dashed #e4e4e7",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#52525b",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Agregar vacuna
            </p>
            <div className="sv-vac-grid">
              <div className="sv-field">
                <label className="sv-field__label">Nombre de la vacuna</label>
                <input
                  type="text"
                  className="sv-field__input"
                  value={newVac.nombre}
                  onChange={(e) => updateNewVac("nombre", e.target.value)}
                  placeholder="Ej: Rabia, Moquillo, Parvovirus"
                />
              </div>
              <div className="sv-field">
                <label className="sv-field__label">Fecha de aplicación</label>
                <DatePicker
                  selected={newVac.fecha ? new Date(newVac.fecha) : null}
                  onChange={(date: Date | null) =>
                    updateNewVac("fecha", date ? date.toISOString().split("T")[0] : "")
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="sv-field__input"
                  wrapperClassName="sv-datepicker-wrapper"
                />
              </div>
              <div className="sv-field">
                <label className="sv-field__label">
                  Próxima dosis (opcional)
                </label>
                <DatePicker
                  selected={newVac.proximaDosis ? new Date(newVac.proximaDosis) : null}
                  onChange={(date: Date | null) =>
                    updateNewVac("proximaDosis", date ? date.toISOString().split("T")[0] : undefined)
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY (opcional)"
                  className="sv-field__input"
                  wrapperClassName="sv-datepicker-wrapper"
                />
              </div>
              <div className="sv-field" style={{ justifyContent: "flex-end" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    paddingTop: "1.6rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={newVac.verificada}
                    onChange={(e) =>
                      updateNewVac("verificada", e.target.checked)
                    }
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    Verificada por veterinario
                  </span>
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={addVaccine}
              disabled={!newVac.nombre.trim() || !newVac.fecha}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.5rem 1.1rem",
                borderRadius: 999,
                background: "#ff6b6b",
                color: "#fff",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: 900,
                cursor:
                  !newVac.nombre.trim() || !newVac.fecha
                    ? "not-allowed"
                    : "pointer",
                opacity: !newVac.nombre.trim() || !newVac.fecha ? 0.5 : 1,
                transition: "opacity 150ms ease",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                add
              </span>
              Agregar vacuna
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
