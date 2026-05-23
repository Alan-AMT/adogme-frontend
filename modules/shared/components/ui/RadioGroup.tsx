// modules/shared/components/ui/RadioGroup.tsx
"use client";

import { useId, type ReactElement } from "react";

export type RadioGroupOption<T> = {
  value: T;
  label: string;
  description?: string;
  icon?: string;
};

export interface RadioGroupProps<T extends string | number | boolean> {
  label?: string;
  required?: boolean;
  value: T | undefined;
  onChange: (value: T) => void;
  options: RadioGroupOption<T>[];
  error?: string;
  helperText?: string;
  layout?: "inline" | "grid";
  variant?: "plain" | "card";
  name?: string;
  className?: string;
}

// ── Estilos por variant + layout ─────────────────────────────────────────────
function buildBtnClasses(opts: {
  selected: boolean;
  layout: "inline" | "grid";
  variant: "plain" | "card";
  isYes: boolean;
  isNo: boolean;
}): string {
  const { selected, layout, variant, isYes, isNo } = opts;

  const base =
    "flex items-center justify-center gap-1.5 cursor-pointer select-none " +
    "border-[1.5px] font-[600] transition-all duration-200";

  if (layout === "inline") {
    // Estilo Sí/No (af-yn__btn)
    const inline = "flex-1 px-4 py-2.5 rounded-[10px] text-sm";
    if (selected && isYes) {
      return `${base} ${inline} border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]`;
    }
    if (selected && isNo) {
      return `${base} ${inline} border-[#ef4444] bg-[#fef2f2] text-[#ef4444]`;
    }
    if (selected) {
      return `${base} ${inline} border-[var(--brand)] bg-[#fff5f5] text-[var(--brand)]`;
    }
    return `${base} ${inline} border-[#e4e4e7] bg-[#fafafa] text-[#52525b] hover:border-[#d4d4d8] hover:bg-white hover:text-[#27272a]`;
  }

  // grid layout
  if (variant === "card") {
    const card =
      "flex-col gap-1.5 px-2 py-3.5 rounded-[14px] border-2 text-[0.78rem] font-[800] text-center";
    if (selected) {
      return `${base.replace("border-[1.5px]", "")} ${card} border-[var(--brand)] bg-[#fff5f5] text-[var(--brand)]`;
    }
    return `${base.replace("border-[1.5px]", "")} ${card} border-[#e4e4e7] bg-[#fafafa] text-[#71717a] hover:border-[#d4d4d8] hover:bg-white hover:text-[#3f3f46]`;
  }

  // grid plain
  const plain = "px-3 py-2.5 rounded-[12px] text-sm";
  if (selected) {
    return `${base} ${plain} border-[var(--brand)] bg-[#fff5f5] text-[var(--brand)]`;
  }
  return `${base} ${plain} border-[#e4e4e7] bg-[#fafafa] text-[#52525b] hover:border-[#d4d4d8] hover:bg-white hover:text-[#27272a]`;
}

export function RadioGroup<T extends string | number | boolean>({
  label,
  required,
  value,
  onChange,
  options,
  error,
  helperText,
  layout = "inline",
  variant = "plain",
  name,
  className = "",
}: RadioGroupProps<T>): ReactElement {
  const reactId = useId();
  const groupName = name ?? `radio-group-${reactId}`;

  const containerCls =
    layout === "grid"
      ? "grid gap-2.5 grid-cols-2 sm:grid-cols-4"
      : "flex flex-wrap gap-2";

  return (
    <div
      className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
    >
      {label && (
        <label
          className={`text-[11px] font-[700] ${error ? "text-[#b91c1c]" : "text-[#a1a1aa]"} uppercase tracking-[0.07em]`}
        >
          {label}
          {required && <span className="text-[var(--brand)] ml-1">*</span>}
        </label>
      )}

      <div className={containerCls} role="radiogroup" aria-label={label}>
        {options.map((opt, idx) => {
          const selected = value !== undefined && value === opt.value;
          // Detect Sí/No semantics for inline coloring
          const isYes =
            opt.value === true ||
            (typeof opt.value === "string" &&
              /^(s[ií]|yes|true)$/i.test(opt.value));
          const isNo =
            opt.value === false ||
            (typeof opt.value === "string" && /^(no|false)$/i.test(opt.value));

          const inputId = `${groupName}-${idx}`;
          const stringValue =
            typeof opt.value === "boolean"
              ? String(opt.value)
              : String(opt.value);

          return (
            <label
              key={`${stringValue}-${idx}`}
              htmlFor={inputId}
              className={`relative ${buildBtnClasses({
                selected,
                layout,
                variant,
                isYes,
                isNo,
              })}`}
            >
              {/* Input anclado al label (position:relative del label es lo que
                  evita que el browser scrollee <html> para enfocarlo). No usar
                  `sr-only` porque define position:absolute con static-position
                  fuera del viewport y dispara focus-auto-scroll del navegador. */}
              <input
                id={inputId}
                type="radio"
                name={groupName}
                checked={selected}
                onChange={() => onChange(opt.value)}
                value={stringValue}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: "none",
                  margin: 0,
                }}
              />

              {variant === "card" && opt.icon && (
                <span
                  className="material-symbols-outlined leading-none"
                  style={{ fontSize: 22 }}
                >
                  {opt.icon}
                </span>
              )}

              {variant !== "card" && opt.icon && (
                <span
                  className="material-symbols-outlined leading-none"
                  style={{ fontSize: 18 }}
                >
                  {opt.icon}
                </span>
              )}

              <span>{opt.label}</span>

              {variant === "card" && opt.description && (
                <span className="text-[10px] font-[600] text-current opacity-75 leading-tight">
                  {opt.description}
                </span>
              )}
            </label>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-[800] text-[#b91c1c] flex items-center gap-1">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 13,
              fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14",
            }}
          >
            error
          </span>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-[#9ca3af] font-[600]">{helperText}</p>
      )}
    </div>
  );
}

// ─── YesNoRadio helper ──────────────────────────────────────────────────────
const YES_NO_OPTIONS: RadioGroupOption<boolean>[] = [
  { value: true, label: "Sí", icon: "check" },
  { value: false, label: "No", icon: "close" },
];

export function YesNoRadio(
  props: Omit<RadioGroupProps<boolean>, "options" | "layout"> & {
    layout?: "inline";
  },
): ReactElement {
  const { layout = "inline", ...rest } = props;
  return (
    <RadioGroup<boolean> {...rest} options={YES_NO_OPTIONS} layout={layout} />
  );
}
