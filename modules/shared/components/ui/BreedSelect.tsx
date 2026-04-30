"use client";

import CreatableSelect from "react-select/creatable";
import type { CSSObjectWithLabel } from "react-select";
import { DOG_BREEDS } from "../../data/breeds";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

type Option = { value: string; label: string };

const OPTIONS: Option[] = DOG_BREEDS.map((b) => ({ value: b, label: b }));

const styles = {
  control: (base: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
    ...base,
    padding: "0.1rem 0.25rem",
    borderRadius: "0.85rem",
    border: state.isFocused ? "1.5px solid #ff6b6b" : "1.5px solid #e4e4e7",
    boxShadow: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
    minHeight: "unset",
    "&:hover": {
      border: state.isFocused ? "1.5px solid #ff6b6b" : "1.5px solid #e4e4e7",
    },
  }),
  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: "0.35rem 0.6rem",
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#18181b",
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#18181b",
  }),
  placeholder: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#a1a1aa",
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: "0.85rem",
    overflow: "hidden",
    fontSize: "0.85rem",
    zIndex: 10,
  }),
  option: (
    base: CSSObjectWithLabel,
    state: { isFocused: boolean; isSelected: boolean },
  ) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(255,107,107,0.15)"
      : state.isFocused
        ? "rgba(255,107,107,0.08)"
        : "#fff",
    color: "#18181b",
    cursor: "pointer",
  }),
};

export function BreedSelect({ value, onChange, placeholder, id }: Props) {
  const selected: Option | null = value ? { value, label: value } : null;

  return (
    <CreatableSelect
      inputId={id}
      isClearable
      options={OPTIONS}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      onCreateOption={(typed) => onChange(typed)}
      placeholder={placeholder ?? "Buscar o escribir raza..."}
      noOptionsMessage={() => "Sin coincidencias"}
      formatCreateLabel={(input) => `Usar "${input}"`}
      styles={styles}
    />
  );
}
