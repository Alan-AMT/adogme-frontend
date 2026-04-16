// modules/home/infrastructure/MockHomeService.ts
// Fuente de verdad: modules/shared/mockData/ — NO duplicar datos aquí

import {
  MOCK_DOGS as SHARED_DOGS,
  getAvailableDogs,
} from "../../shared/mockData/dogs.mock";
import {
  MOCK_SHELTERS as SHARED_SHELTERS,
} from "../../shared/mockData/shelters.mock";
import type { AdoptionStory } from "../domain/AdoptionStory";
import type { DogCard } from "../domain/DogCard";
import type { ShelterCard } from "../domain/ShelterCard";
import type { IHomeService } from "./IHomeService";

// ─── Delay helper ─────────────────────────────────────────────────────────────

const delay = (ms = 400) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ─── Mappers ──────────────────────────────────────────────────────────────────

function nivelEnergiaLabel(nivel: string): string {
  const map: Record<string, string> = {
    baja: "Bajo", moderada: "Moderado", alta: "Alto", muy_alta: "Muy alto",
  };
  return map[nivel] ?? nivel;
}

function estadoLabel(estado: string): string {
  const map: Record<string, string> = {
    disponible: "Disponible", en_proceso: "En adopción", adoptado: "Adoptado",
  };
  return map[estado] ?? estado;
}

// ─── Historias de adopción (perros adoptados del mock real) ───────────────────

const ADOPTADOS = SHARED_DOGS.filter(d => d.estado === "adoptado");

const MOCK_STORIES: AdoptionStory[] = [
  {
    id: 1,
    dogName: ADOPTADOS[0]?.nombre ?? "Toby",
    adopterName: "la familia Martínez",
    storyShort: "Llegó asustado y flaco. Hoy corre por el jardín y duerme en la cama de los niños. No pudimos imaginar la vida sin él.",
    imageUrl: ADOPTADOS[0]?.foto ?? "/assets/dogs/dog1.jpg",
  },
  {
    id: 2,
    dogName: ADOPTADOS[1]?.nombre ?? "Nala",
    adopterName: "Sofía R.",
    storyShort: "No sabía mucho de perros. Él me enseñó paciencia, amor incondicional y a salir a caminar todos los días.",
    imageUrl: ADOPTADOS[1]?.foto ?? "/assets/dogs/dog7.jpg",
  },
  {
    id: 3,
    dogName: "Bruno",
    adopterName: "los García",
    storyShort: "Tenía miedo de todo cuando llegó. Hoy es el más juguetón y protector de la casa. La mejor decisión que tomamos.",
    imageUrl: "/assets/dogs/dog5.jpg",
  },
];

// ─── Service ──────────────────────────────────────────────────────────────────

export class MockHomeService implements IHomeService {
  async getMainDogs(): Promise<DogCard[]> {
    await delay(400);
    return getAvailableDogs()
      .map(d => ({
        id:         d.id,
        nombre:     d.nombre,
        raza:       d.raza,
        descripcion: d.descripcion,
        edad:       Math.max(1, Math.round(d.edad / 12)),
        tamano:     d.tamano.charAt(0).toUpperCase() + d.tamano.slice(1),
        nivelEnergia: nivelEnergiaLabel(d.nivelEnergia),
        salud:      d.salud,
        estado:     estadoLabel(d.estado),
        imageUrl:   d.foto,
        tamanoRaw:  d.tamano,
        nivelEnergiaRaw: d.nivelEnergia,
        edadCat:    d.edadCategoria,
      }));
  }

  async getHomeSheltersList(): Promise<ShelterCard[]> {
    await delay(400);
    return SHARED_SHELTERS.map(s => ({
      id:                   s.id,
      nombre:               s.nombre,
      slug:                 s.slug,
      ubicacion:            s.ubicacion,
      alcaldia:             s.alcaldia ?? s.ubicacion,
      descripcion:          s.descripcion,
      correo:               s.correo,
      telefono:             s.telefono,
      logo:                 s.logo,
      imagenPortada:        s.imagenPortada,
      fechaRegistro:        s.fechaRegistro,
      aprobado:             s.aprobado,
      imageUrl:             s.imagenPortada,
      adopcionesRealizadas: s.adopcionesRealizadas ?? 0,
      perrosDisponibles:    s.perrosDisponibles ?? 0,
      calificacion:         s.calificacion,
    }));
  }

  async getLatestStories(): Promise<AdoptionStory[]> {
    await delay(400);
    return MOCK_STORIES;
  }
}
