// modules/shared/components/ui/CheckboxGroup.tsx
"use client";

import { useId, type ReactElement } from "react";

export type CheckboxGroupOption<T> = {
  value: T;
  label: string;
  description?: string;
  icon?: string;
};

export interface CheckboxGroupProps<T extends string | number> {
  label?: string;
  required?: boolean;
  value: T[] | undefined | null;
  onChange: (value: T[]) => void;
  options: CheckboxGroupOption<T>[];
  error?: string;
  helperText?: string;
  min?: number;
  max?: number;
  layout?: "list" | "grid";
  className?: string;
}

function itemClasses(opts: {
  selected: boolean;
  disabled: boolean;
  layout: "list" | "grid";
}): string {
  const { selected, disabled, layout } = opts;
  const base =
    "flex items-start gap-3 select-none transition-all duration-200 " +
    "border-[1.5px] rounded-[12px] px-3 py-2.5";

  const cursor = disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer";

  if (selected) {
    return [
      base,
      cursor,
      "border-[var(--brand)] bg-[#fff5f5]",
      layout === "grid" ? "" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    base,
    cursor,
    "border-[#e4e4e7] bg-[#fafafa]",
    !disabled ? "hover:border-[#d4d4d8] hover:bg-white" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function CheckboxGroup<T extends string | number>({
  label,
  required,
  value,
  onChange,
  options,
  error,
  helperText,
  min,
  max,
  layout = "list",
  className = "",
}: CheckboxGroupProps<T>): ReactElement {
  const reactId = useId();
  const safeValue: T[] = Array.isArray(value) ? value : [];
  const limitReached = typeof max === "number" && safeValue.length >= max;

  const containerCls =
    layout === "grid"
      ? "grid gap-2 grid-cols-1 sm:grid-cols-2"
      : "flex flex-col gap-2";

  const toggle = (opt: T) => {
    if (safeValue.includes(opt)) {
      onChange(safeValue.filter((v) => v !== opt));
    } else {
      if (typeof max === "number" && safeValue.length >= max) return;
      onChange([...safeValue, opt]);
    }
  };

  // Hint text when min/max provided and no error
  const limitsHint = (() => {
    if (error || helperText) return null;
    if (typeof min === "number" && typeof max === "number") {
      return min === max
        ? `Selecciona ${min}`
        : `Selecciona entre ${min} y ${max}`;
    }
    if (typeof min === "number") return `Selecciona al menos ${min}`;
    if (typeof max === "number") return `Selecciona hasta ${max}`;
    return null;
  })();

  return (
    <div
      className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
    >
      {label && (
        <div className="flex items-center justify-between">
          <label
            className={`text-[11px] font-[700] ${error ? "text-[#b91c1c]" : "text-[#a1a1aa]"} uppercase tracking-[0.07em]`}
          >
            {label}
            {required && <span className="text-[var(--brand)] ml-1">*</span>}
          </label>
          {typeof max === "number" && (
            <span className="text-[11px] font-[700] tabular-nums text-[#9ca3af]">
              {safeValue.length}/{max}
            </span>
          )}
        </div>
      )}

      <div className={containerCls}>
        {options.map((opt, idx) => {
          const selected = safeValue.includes(opt.value);
          const disabled = !selected && limitReached;
          const inputId = `cbg-${reactId}-${idx}`;

          return (
            <label
              key={`${String(opt.value)}-${idx}`}
              htmlFor={inputId}
              className={itemClasses({ selected, disabled, layout })}
              aria-disabled={disabled || undefined}
            >
              <div className="relative flex-shrink-0 mt-[1px]">
                <input
                  id={inputId}
                  type="checkbox"
                  className="peer sr-only"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => toggle(opt.value)}
                />
                <div
                  className={[
                    "w-5 h-5 rounded-[6px] border-2 flex items-center justify-center",
                    "transition-all duration-200",
                    "peer-focus-visible:shadow-[0_0_0_4px_rgba(255,107,107,0.2)]",
                    selected
                      ? "bg-[var(--brand)] border-[var(--brand)]"
                      : "bg-white border-[#d4d4d8]",
                  ].join(" ")}
                >
                  {selected && (
                    <span
                      className="material-symbols-outlined text-white leading-none"
                      style={{
                        fontSize: 13,
                        fontVariationSettings:
                          "'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 14",
                      }}
                    >
                      check
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-0.5 pt-[1px] flex-1">
                <span className="text-[13px] font-[700] text-[#1f2937] leading-snug flex items-center gap-1.5">
                  {opt.icon && (
                    <span
                      className="material-symbols-outlined leading-none"
                      style={{ fontSize: 16 }}
                    >
                      {opt.icon}
                    </span>
                  )}
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[12px] text-[#71717a] font-[500] leading-relaxed">
                    {opt.description}
                  </span>
                )}
              </div>
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
      {!error && !helperText && limitsHint && (
        <p className="text-xs text-[#9ca3af] font-[600]">{limitsHint}</p>
      )}
    </div>
  );
}
