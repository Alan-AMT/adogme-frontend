// modules/shared/mockData/adoptions.mock.ts
// Solicitudes mock representativas con el nuevo schema de AdoptionFormData
// (6 pasos: datos personales, vivienda, rutina, mascotas, responsabilidad,
// confirmaciones).

import type {
  AdoptionRequest,
  AdoptionRequestListItem,
} from '../domain/AdoptionRequest'
import { SHELTER_IDS } from './shelters.mock'

const ADOPTANTE_ID = '101' // Ana García

export const MOCK_ADOPTION_REQUESTS: AdoptionRequest[] = [

  // ── 1. Pendiente — casa propia, sin mascotas, sin experiencia ────────────
  {
    id: '1001',
    adoptanteId: ADOPTANTE_ID,
    perroId: '1',           // Max — Labrador
    refugioId: SHELTER_IDS.HUELLITAS,
    fecha: '2025-01-20',
    estado: 'pending',
    formVersion: 1,
    compatibilityScore: null,
    images: [],
    formulario: {
      nombreCompleto: 'Ana García',
      edad: 29,
      telefono: '5512345678',
      correo: 'ana@test.com',
      ocupacion: 'Diseñadora gráfica freelance',
      direccion: 'Av. Reforma 123, CDMX',
      redesSociales: '@ana.designs',

      vivienda: {
        tipo: 'casa',
        tenencia: 'propia',
        tieneJardin: true,
        tamanoJardinM2: 40,
        tieneRejaOCerca: true,
      },
      entorno: {
        quienesViven: 'Vivo sola con mi hermana mayor.',
        todosDeAcuerdo: true,
        hayNinos: false,
        hayAlergicos: false,
      },

      rutina: {
        horasSolo: 3,
        dondePermaneceSolo: 'En la sala con acceso al jardín.',
        dondeDormiria: 'dentro_casa',
        actividadFisica: 'activo',
        actividadesPlaneadas: ['caminatas', 'juegos', 'correr'],
      },

      mascotasActuales: {
        tiene: false,
      },
      experienciaPrevia: {
        tuvo: false,
      },

      motivacion:
        'Siempre quise un Labrador. Max me recuerda a un perro de mi infancia y me encantaría brindarle un hogar tranquilo y lleno de paseos.',
      siMudanza: 'Max se mudaría conmigo. Solo busco lugares pet friendly.',
      siComportamientoNoEsperado:
        'Buscaría apoyo de un entrenador o etólogo certificado.',
      situacionesParaDevolver: 'Solo en caso de una emergencia médica grave.',
      capacidadEconomica: true,
      cuidadosMedicos:
        'Tengo veterinario de confianza y presupuesto mensual para sus cuidados.',

      aceptaAlimentacionVeterinaria: true,
      aceptaNoAbandono: true,
      aceptaContactarRefugio: true,
      aceptaSeguimiento: true,
      aceptaInfoVeridica: true,
    },
    revisiones: [
      {
        id: '1',
        applicationId: '1001',
        fromStatus: 'pending',
        toStatus: 'pending',
        note: 'Solicitud enviada por la adoptante.',
        createdAt: '2025-01-20T10:00:00Z',
      },
    ],
    perroNombre: 'Max',
    perroFoto: '/assets/dogs/dog1.jpg',
    refugioNombre: 'Huellitas MX',
    adoptanteNombre: 'Ana García',
  },

  // ── 2. Aprobada — depto rentado, con mascota actual y experiencia ───────
  {
    id: '1003',
    adoptanteId: ADOPTANTE_ID,
    perroId: '7',           // Churro — Salchicha
    refugioId: SHELTER_IDS.PATITAS,
    fecha: '2024-12-05',
    estado: 'approved',
    formVersion: 1,
    compatibilityScore: null,
    images: [],
    formulario: {
      nombreCompleto: 'Ana García',
      edad: 29,
      telefono: '5512345678',
      correo: 'ana@test.com',
      ocupacion: 'Diseñadora gráfica freelance',
      direccion: 'Calle Pino 45, Depto 302, CDMX',

      vivienda: {
        tipo: 'departamento',
        tenencia: 'rentada',
        permiteAnimales: true,
        tieneJardin: false,
      },
      entorno: {
        quienesViven: 'Vivo con mi pareja y un gato adulto.',
        todosDeAcuerdo: true,
        hayNinos: false,
        hayAlergicos: false,
      },

      rutina: {
        horasSolo: 5,
        dondePermaneceSolo: 'En la sala, con su cama y juguetes.',
        dondeDormiria: 'dentro_casa',
        actividadFisica: 'moderado',
        actividadesPlaneadas: ['caminatas', 'compania_tranquila'],
      },

      mascotasActuales: {
        tiene: true,
        cuantasYCuales: 'Un gato adulto (5 años).',
        edades: '5 años',
        estanEsterilizadas: true,
        descripcionConvivencia:
          'El gato es tranquilo y ya convivió con perros pequeños sin problema.',
      },
      experienciaPrevia: {
        tuvo: true,
        quePaso:
          'Tuve una salchicha por 8 años, falleció por causas naturales y la cuidé hasta el final.',
      },

      motivacion:
        'Quiero un perro pequeño que pueda llevar a todos lados. Churro me parece perfecto para nuestra vida en el depto.',
      siMudanza: 'Siempre buscaríamos opciones pet friendly.',
      siComportamientoNoEsperado: 'Acudiría con un etólogo recomendado.',
      situacionesParaDevolver: 'Ninguna razonable que pueda anticipar.',
      capacidadEconomica: true,
      cuidadosMedicos: 'Plan veterinario mensual y ahorro para emergencias.',

      aceptaAlimentacionVeterinaria: true,
      aceptaNoAbandono: true,
      aceptaContactarRefugio: true,
      aceptaSeguimiento: true,
      aceptaInfoVeridica: true,
    },
    revisiones: [
      {
        id: '3',
        applicationId: '1003',
        fromStatus: 'pending',
        toStatus: 'in_review',
        note: null,
        createdAt: '2024-12-07T10:00:00Z',
      },
      {
        id: '4',
        applicationId: '1003',
        fromStatus: 'in_review',
        toStatus: 'approved',
        note: '¡Excelente perfil! Aprobada.',
        createdAt: '2024-12-10T14:00:00Z',
      },
    ],
    perroNombre: 'Churro',
    perroFoto: '/assets/dogs/dog7.jpg',
    refugioNombre: 'Patitas Libres',
    adoptanteNombre: 'Ana García',
  },

  // ── 3. Rechazada — depto pequeño, perfil no compatible ──────────────────
  {
    id: '1004',
    adoptanteId: ADOPTANTE_ID,
    perroId: '3',           // Thor — Husky
    refugioId: SHELTER_IDS.HUELLITAS,
    fecha: '2024-11-20',
    estado: 'rejected',
    formVersion: 1,
    compatibilityScore: null,
    images: [],
    formulario: {
      nombreCompleto: 'Ana García',
      edad: 29,
      telefono: '5512345678',
      correo: 'ana@test.com',
      ocupacion: 'Diseñadora gráfica freelance',
      direccion: 'Calle Pino 45, Depto 302, CDMX',

      vivienda: {
        tipo: 'departamento',
        tenencia: 'rentada',
        permiteAnimales: true,
        tieneJardin: false,
      },
      entorno: {
        quienesViven: 'Vivo sola.',
        todosDeAcuerdo: true,
        hayNinos: false,
        hayAlergicos: false,
      },

      rutina: {
        horasSolo: 9,
        dondePermaneceSolo: 'En la sala.',
        dondeDormiria: 'dentro_casa',
        actividadFisica: 'sedentario',
        actividadesPlaneadas: ['compania_tranquila'],
      },

      mascotasActuales: {
        tiene: false,
      },
      experienciaPrevia: {
        tuvo: false,
      },

      motivacion:
        'Siempre quise un Husky por su belleza y porque me parecen leales. Estoy lista para aprender.',
      siMudanza: 'Lo buscaría conmigo siempre.',
      siComportamientoNoEsperado: 'Buscaría ayuda profesional.',
      situacionesParaDevolver: 'Solo en una emergencia mayor.',
      capacidadEconomica: true,
      cuidadosMedicos: 'Tengo veterinario y plan de gastos.',

      aceptaAlimentacionVeterinaria: true,
      aceptaNoAbandono: true,
      aceptaContactarRefugio: true,
      aceptaSeguimiento: true,
      aceptaInfoVeridica: true,
    },
    revisiones: [
      {
        id: '5',
        applicationId: '1004',
        fromStatus: 'pending',
        toStatus: 'rejected',
        note:
          'Thor necesita dueño con experiencia en la raza y espacio para ejercicio intenso. El perfil actual no es compatible.',
        createdAt: '2024-11-22T11:00:00Z',
      },
    ],
    perroNombre: 'Thor',
    perroFoto: '/assets/dogs/dog3.jpg',
    refugioNombre: 'Huellitas MX',
    adoptanteNombre: 'Ana García',
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getRequestsByAdoptante = (adoptanteId: string): AdoptionRequest[] =>
  MOCK_ADOPTION_REQUESTS.filter((r) => r.adoptanteId === adoptanteId)

export const getRequestsByShelterId = (refugioId: string): AdoptionRequest[] =>
  MOCK_ADOPTION_REQUESTS.filter((r) => r.refugioId === refugioId)

export const getRequestById = (id: string): AdoptionRequest | undefined =>
  MOCK_ADOPTION_REQUESTS.find((r) => r.id === id)

export const MOCK_REQUESTS_LIST: AdoptionRequestListItem[] =
  MOCK_ADOPTION_REQUESTS.map((r) => ({
    id: r.id,
    adoptanteId: r.adoptanteId,
    perroId: r.perroId,
    refugioId: r.refugioId,
    fecha: r.fecha,
    estado: r.estado,
    perroNombre: r.perroNombre,
    perroFoto: r.perroFoto,
    refugioNombre: r.refugioNombre,
    adoptanteNombre: r.adoptanteNombre,
  }))
