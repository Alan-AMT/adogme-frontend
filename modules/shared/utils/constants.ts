// modules/shared/utils/constants.ts
// ─────────────────────────────────────────────────────────────────────────────
// Constantes y catálogos estáticos del proyecto.
// Sin lógica — solo datos que no cambian.
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestStatus } from "../domain/AdoptionRequest";
import type {
  AgeCategory,
  DogSize,
  DogStatus,
  EnergyLevel,
  PersonalityTag,
} from "../domain/Dog";
import type { ShelterStatus } from "../domain/Shelter";

// ─── Razas comunes en México ──────────────────────────────────────────────────

export const DOG_BREEDS: string[] = [
  "Mestizo",
  "Labrador Retriever",
  "Golden Retriever",
  "Beagle",
  "Husky Siberiano",
  "Pitbull",
  "Bulldog Francés",
  "Bulldog Inglés",
  "Salchicha / Dachshund",
  "Chihuahua",
  "Poodle / Caniche",
  "Schnauzer",
  "Shih Tzu",
  "Yorkshire Terrier",
  "Border Collie",
  "Pastor Alemán",
  "Rottweiler",
  "Dobermann",
  "Boxer",
  "Dálmata",
  "Cocker Spaniel",
  "Bichón Frisé",
  "Pomerania",
  "Maltés",
  "Jack Russell Terrier",
  "Australian Shepherd",
  "Great Dane / Gran Danés",
  "Shar Pei",
  "Akita",
  "Samoyedo",
  "Malamute de Alaska",
  "Weimaraner",
  "Vizsla",
  "Basenji",
  "Whippet",
  "Greyhound / Galgo",
  "Basset Hound",
  "Setter Irlandés",
  "Bloodhound",
  "Mastín",
  "Cane Corso",
  "American Staffordshire",
];

// ─── Estados de México ────────────────────────────────────────────────────────

export const MEXICAN_STATES: string[] = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

// ─── Ciudades principales ─────────────────────────────────────────────────────

export const MAJOR_CITIES: string[] = [
  "Ciudad de México",
  "Guadalajara",
  "Monterrey",
  "Puebla",
  "Tijuana",
  "León",
  "Juárez",
  "Querétaro",
  "San Luis Potosí",
  "Mérida",
  "Mexicali",
  "Aguascalientes",
  "Culiacán",
  "Acapulco",
  "Hermosillo",
  "Saltillo",
  "Morelia",
  "Veracruz",
  "Cancún",
  "Toluca",
  "Chihuahua",
  "Torreón",
  "Oaxaca",
  "Villahermosa",
  "Tuxtla Gutiérrez",
  "Ensenada",
  "Los Cabos",
  "Mazatlán",
  "Puerto Vallarta",
  "San Miguel de Allende",
];

// ─── Labels legibles ──────────────────────────────────────────────────────────

export const DOG_SIZE_LABELS: Record<DogSize, string> = {
  pequeño: "Pequeño",
  mediano: "Mediano",
  grande: "Grande",
  gigante: "Gigante",
};

export const DOG_SIZE_RANGE: Record<DogSize, string> = {
  pequeño: "hasta 10 kg",
  mediano: "10 – 25 kg",
  grande: "25 – 45 kg",
  gigante: "más de 45 kg",
};

export const ENERGY_LEVEL_LABELS: Record<EnergyLevel, string> = {
  baja: "Baja",
  moderada: "Moderada",
  alta: "Alta",
  muy_alta: "Muy alta",
};

export const ENERGY_LEVEL_DESC: Record<EnergyLevel, string> = {
  baja: "Paseos cortos, ama los sofás",
  moderada: "2 paseos diarios, juego ligero",
  alta: "Ejercicio diario intenso",
  muy_alta: "Necesita ejercicio extenuante",
};

export const AGE_CATEGORY_LABELS: Record<AgeCategory, string> = {
  cachorro: "Cachorro",
  joven: "Joven",
  adulto: "Adulto",
  senior: "Senior",
};

export const AGE_CATEGORY_RANGE: Record<AgeCategory, string> = {
  cachorro: "Menos de 1 año",
  joven: "1 – 3 años",
  adulto: "3 – 7 años",
  senior: "Más de 7 años",
};

export const DOG_STATUS_LABELS: Record<DogStatus, string> = {
  disponible: "Disponible",
  en_proceso: "En proceso",
  adoptado: "Adoptado",
  no_disponible: "No disponible",
};

export const DOG_STATUS_COLOR: Record<DogStatus, string> = {
  disponible: "#22c55e", // green
  en_proceso: "#f59e0b", // amber
  adoptado: "#3b82f6", // blue
  no_disponible: "#94a3b8", // slate
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pendiente",
  in_review: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
};

export const REQUEST_STATUS_COLOR: Record<RequestStatus, string> = {
  pending: "#f59e0b",
  in_review: "#3b82f6",
  approved: "#22c55e",
  rejected: "#ef4444",
  cancelled: "#94a3b8",
};

export const SHELTER_STATUS_LABELS: Record<ShelterStatus, string> = {
  pending: "Pendiente de aprobación",
  approved: "Aprobado",
  rejected: "Rechazado",
  suspended: "Suspendido",
};

export const SHELTER_STATUS_COLOR: Record<ShelterStatus, string> = {
  pending: "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
  suspended: "#94a3b8",
};

// ─── Catálogo completo de tags de personalidad ───────────────────────────────
// La misma lista que dogs.mock.ts pero exportada como catálogo para
// que el formulario del refugio pueda mostrar todos los tags disponibles.

export const PERSONALITY_TAGS_CATALOG: PersonalityTag[] = [
  { id: "1", label: "Juguetón", icon: "sports_tennis", categoria: "caracter" },
  { id: "2", label: "Tranquilo", icon: "self_care", categoria: "caracter" },
  { id: "3", label: "Protector", icon: "security", categoria: "caracter" },
  { id: "4", label: "Curioso", icon: "search", categoria: "caracter" },
  { id: "5", label: "Leal", icon: "favorite", categoria: "caracter" },
  { id: "6", label: "Enérgico", icon: "bolt", categoria: "actividad" },
  { id: "7", label: "Relajado", icon: "weekend", categoria: "actividad" },
  { id: "8", label: "Sociable", icon: "pets", categoria: "socializacion" },
  { id: "9", label: "Tímido", icon: "hide", categoria: "socializacion" },
  { id: "10", label: "Independiente", icon: "flight", categoria: "caracter" },
  {
    id: "11",
    label: "Obediente",
    icon: "check_circle",
    categoria: "entrenamiento",
  },
  {
    id: "12",
    label: "Terco",
    icon: "sentiment_neutral",
    categoria: "entrenamiento",
  },
  {
    id: "13",
    label: "Cariñoso",
    icon: "volunteer_activism",
    categoria: "caracter",
  },
  { id: "14", label: "Activo", icon: "directions_run", categoria: "actividad" },
  {
    id: "15",
    label: "Instinto cazador",
    icon: "track_changes",
    categoria: "caracter",
  },
  { id: "16", label: "Buen guardián", icon: "shield", categoria: "caracter" },
  {
    id: "17",
    label: "Amigable",
    icon: "handshake",
    categoria: "socializacion",
  },
  {
    id: "18",
    label: "Nervioso",
    icon: "sentiment_worried",
    categoria: "socializacion",
  },
  {
    id: "19",
    label: "Inteligente",
    icon: "psychology",
    categoria: "entrenamiento",
  },
  { id: "20", label: "Territorial", icon: "fence", categoria: "caracter" },
];

// ─── Lookup por label ────────────────────────────────────────────────────────

const _tagByLabelMap = new Map(
  PERSONALITY_TAGS_CATALOG.map((t) => [t.label.toLowerCase(), t]),
);

/** Devuelve el tag completo del catálogo cuyo label coincida (case-insensitive).
 *  Garantiza que el id, icon y categoria sean los del catálogo local. */
export function getPersonalityTagByLabel(label: string): PersonalityTag | undefined {
  return _tagByLabelMap.get(label.toLowerCase());
}

/** Devuelve el icon (Material Symbol) del tag cuyo label coincida (case-insensitive). */
export function getPersonalityTagIcon(label: string): string {
  return _tagByLabelMap.get(label.toLowerCase())?.icon ?? "label";
}

// ─── Opciones de filtro (para selects en DogsSearchView) ─────────────────────

export const FILTER_SIZE_OPTIONS = [
  { value: "", label: "Todos los tamaños" },
  { value: "pequeño", label: "Pequeño (hasta 10 kg)" },
  { value: "mediano", label: "Mediano (10–25 kg)" },
  { value: "grande", label: "Grande (25–45 kg)" },
  { value: "gigante", label: "Gigante (+45 kg)" },
];

export const FILTER_ENERGY_OPTIONS = [
  { value: "", label: "Cualquier energía" },
  { value: "baja", label: "Baja — sofá lover" },
  { value: "moderada", label: "Moderada" },
  { value: "alta", label: "Alta" },
  { value: "muy_alta", label: "Muy alta — atleta" },
];

export const FILTER_AGE_OPTIONS = [
  { value: "", label: "Cualquier edad" },
  { value: "cachorro", label: "Cachorro (< 1 año)" },
  { value: "joven", label: "Joven (1–3 años)" },
  { value: "adulto", label: "Adulto (3–7 años)" },
  { value: "senior", label: "Senior (7+ años)" },
];

export const FILTER_SEX_OPTIONS = [
  { value: "", label: "Cualquier sexo" },
  { value: "macho", label: "Macho" },
  { value: "hembra", label: "Hembra" },
];
