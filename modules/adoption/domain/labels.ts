// modules/adoption/domain/labels.ts
// Mapas de etiquetas legibles para los enums del formulario de adopción.
// Centralizados aquí para evitar duplicación entre vistas.

import type {
  HousingType,
  Tenencia,
  LugarDormir,
  ActividadFisica,
  ActividadConPerro,
} from '../../shared/domain/AdoptionRequest'

export const HOUSING_TYPE_LABELS: Record<HousingType, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  casa_campo: 'Casa de campo',
  otro: 'Otro',
}

export const TENANCIA_LABELS: Record<Tenencia, string> = {
  propia: 'Propia',
  rentada: 'Rentada',
}

export const LUGAR_DORMIR_LABELS: Record<LugarDormir, string> = {
  dentro_casa: 'Dentro de casa',
  patio_jardin: 'Patio o jardín',
  area_designada: 'Área designada',
  otro: 'Otro',
}

export const ACTIVIDAD_FISICA_LABELS: Record<ActividadFisica, string> = {
  sedentario: 'Sedentario',
  moderado: 'Moderado',
  activo: 'Activo',
  muy_activo: 'Muy activo',
}

export const ACTIVIDAD_CON_PERRO_LABELS: Record<ActividadConPerro, string> = {
  caminatas: 'Caminatas',
  senderismo: 'Senderismo',
  juegos: 'Juegos',
  correr: 'Correr',
  compania_tranquila: 'Compañía tranquila',
  otro: 'Otro',
}
