// modules/home/infrastructure/MockHomeService.ts
// Fuente de verdad: modules/shared/mockData/ — NO duplicar datos aquí

import {
  MOCK_DOGS as SHARED_DOGS,
  getAvailableDogs,
} from "../../shared/mockData/dogs.mock";
import {
  MOCK_SHELTERS as SHARED_SHELTERS,
} from "../../shared/mockData/shelters.mock";
import type { AdoptionProcess } from "../domain/AdoptionProcess";
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

// ─── Proceso de adopción ──────────────────────────────────────────────────────

export const MOCK_ADOPTION_PROCESS: AdoptionProcess = [
  {
    id: 1, step: 1, icon: "search",
    title: "Explora los perfiles",
    subtitle: "Conoce a los perritos disponibles",
    description: "Navega el catálogo de perros en refugios de Gustavo A. Madero. Filtra por tamaño, energía o compatibilidad con tu estilo de vida para encontrar a tu compañero ideal.",
    tips: ["Usa los filtros de tamaño y nivel de energía", "Lee con calma la descripción de cada perfil", "Guarda tus favoritos con el ícono de corazón"],
    duration: "~10 min",
  },
  {
    id: 2, step: 2, icon: "quiz",
    title: "Responde la encuesta",
    subtitle: "Cuéntanos sobre tu hogar",
    description: "Completa un breve cuestionario sobre tu vivienda, rutinas y experiencia con mascotas. Con esta información generamos sugerencias de compatibilidad personalizadas.",
    tips: ["Responde con honestidad para mejores resultados", "Toma en cuenta el espacio disponible en casa", "Considera tu nivel de actividad diaria"],
    duration: "~5 min",
  },
  {
    id: 3, step: 3, icon: "description",
    title: "Envía tu solicitud",
    subtitle: "Da el primer paso oficial",
    description: "Completa el formulario de adopción con tus datos y adjunta los documentos requeridos. El refugio revisará tu solicitud y se pondrá en contacto contigo en 2–3 días hábiles.",
    tips: ["Ten a la mano tu identificación oficial", "Adjunta comprobante de domicilio reciente", "Describe brevemente tu motivación para adoptar"],
    duration: "~15 min",
  },
  {
    id: 4, step: 4, icon: "handshake",
    title: "Visita al refugio",
    subtitle: "Conoce a tu futuro compañero",
    description: "Agenda una visita presencial para interactuar con el perrito y confirmar la compatibilidad. El equipo del refugio estará contigo para resolver dudas y guiarte en el proceso.",
    tips: ["Lleva a todos los miembros del hogar a la visita", "Si tienes otra mascota, consulta si puede asistir", "Prepara preguntas sobre hábitos y salud del perro"],
    duration: "1–2 horas",
  },
  {
    id: 5, step: 5, icon: "favorite",
    title: "¡Bienvenido a casa!",
    subtitle: "El inicio de una nueva historia",
    description: "Una vez aprobada la solicitud, coordina con el refugio la fecha de entrega. Asegúrate de tener listo el espacio, comida, agua y un veterinario de confianza para la primera revisión.",
    tips: ["Prepara un área tranquila para los primeros días", "Ten paciencia durante el período de adaptación", "Programa una visita al veterinario en la primera semana"],
    duration: "A tu ritmo",
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
      ciudad:               s.ciudad,
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

  async getAdoptionProcess(): Promise<AdoptionProcess> {
    await delay(300);
    return MOCK_ADOPTION_PROCESS;
  }
}
