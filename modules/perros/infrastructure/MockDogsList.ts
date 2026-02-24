import { Dog } from "../domain/dog";
import { DogFilters } from "../domain/dogFilters";
import { IDogsList } from "../domain/IDogsList";

export const REFUGIOS = [
  { id: 1, nombre: "Refugio Patitas GAM" },
  { id: 2, nombre: "Huellitas Felices Iztapalapa" },
  { id: 3, nombre: "Refugio Esperanza Coyoacán" },
];

const MOCK_DOGS: Dog[] = [
  {
    id: 1,
    refugioId: 1,
    shelterName: "Refugio Patitas GAM",
    nombre: "Max",
    edad: 24,
    raza: "Labrador",
    tamano: "grande",
    nivelEnergia: "alta",
    sexo: "macho",
    salud: "Buena",
    estado: "disponible",
    compatibilidad: 0.92,
    descripcion: "Muy juguetón y activo. Le encanta correr y es excelente con niños.",
    fechaRegistro: "2024-11-10",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 2,
    refugioId: 1,
    shelterName: "Refugio Patitas GAM",
    nombre: "Cindy",
    edad: 8,
    raza: "Chihuahua",
    tamano: "pequeño",
    nivelEnergia: "media",
    sexo: "hembra",
    salud: "Excelente",
    estado: "disponible",
    compatibilidad: 0.85,
    descripcion: "Cachorra curiosa y cariñosa. Se adapta bien a departamentos.",
    fechaRegistro: "2025-01-05",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 3,
    refugioId: 2,
    shelterName: "Huellitas Felices Iztapalapa",
    nombre: "Rex",
    edad: 84,
    raza: "Pastor Alemán",
    tamano: "grande",
    nivelEnergia: "media",
    sexo: "macho",
    salud: "Buena",
    estado: "disponible",
    compatibilidad: 0.78,
    descripcion: "Perro adulto tranquilo y leal. Ideal para un compañero protector.",
    fechaRegistro: "2024-09-20",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 4,
    refugioId: 2,
    shelterName: "Huellitas Felices Iztapalapa",
    nombre: "Cooper",
    edad: 36,
    raza: "Beagle",
    tamano: "mediano",
    nivelEnergia: "alta",
    sexo: "macho",
    salud: "Buena",
    estado: "en_proceso",
    compatibilidad: 0.81,
    descripcion: "Muy sociable, le encanta explorar y jugar con otros perros.",
    fechaRegistro: "2024-10-15",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 5,
    refugioId: 1,
    shelterName: "Refugio Patitas GAM",
    nombre: "Amy",
    edad: 108,
    raza: "Poodle",
    tamano: "pequeño",
    nivelEnergia: "baja",
    sexo: "hembra",
    salud: "Regular",
    estado: "disponible",
    compatibilidad: 0.88,
    descripcion: "Perrita dulce y tranquila. Perfecta para hogares pequeños.",
    fechaRegistro: "2024-08-30",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 6,
    refugioId: 3,
    shelterName: "Refugio Esperanza Coyoacán",
    nombre: "Nolan",
    edad: 14,
    raza: "Dálmata",
    tamano: "grande",
    nivelEnergia: "alta",
    sexo: "macho",
    salud: "Excelente",
    estado: "disponible",
    compatibilidad: 0.74,
    descripcion: "Lleno de energía, aprende comandos rápidamente.",
    fechaRegistro: "2025-01-18",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 7,
    refugioId: 3,
    shelterName: "Refugio Esperanza Coyoacán",
    nombre: "Regy",
    edad: 18,
    raza: "Schnauzer",
    tamano: "mediano",
    nivelEnergia: "media",
    sexo: "macho",
    salud: "Buena",
    estado: "disponible",
    compatibilidad: 0.83,
    descripcion: "Joven con mucha personalidad. Convive bien con otros animales.",
    fechaRegistro: "2024-12-01",
    imageUrl: "/dog1.jpg",
  },
  {
    id: 8,
    refugioId: 2,
    shelterName: "Huellitas Felices Iztapalapa",
    nombre: "Luna",
    edad: 6,
    raza: "Mestiza",
    tamano: "mediano",
    nivelEnergia: "alta",
    sexo: "hembra",
    salud: "Excelente",
    estado: "disponible",
    compatibilidad: 0.9,
    descripcion: "Cachorra llena de vida. Aprende rápido y se lleva bien con todos.",
    fechaRegistro: "2025-02-10",
    imageUrl: "/dog1.jpg",
  },
];

export class MockDogsList implements IDogsList {
  public async getDogs(filters: DogFilters): Promise<Dog[]> {
    let results = [...MOCK_DOGS];

    if (filters.queryText) {
      const q = filters.queryText.toLowerCase();
      results = results.filter(
        (d) =>
          d.nombre.toLowerCase().includes(q) ||
          d.raza.toLowerCase().includes(q) ||
          d.shelterName.toLowerCase().includes(q),
      );
    }
    if (filters.tamano) results = results.filter((d) => d.tamano === filters.tamano);
    if (filters.sexo) results = results.filter((d) => d.sexo === filters.sexo);
    if (filters.nivelEnergia) results = results.filter((d) => d.nivelEnergia === filters.nivelEnergia);
    if (filters.estado) results = results.filter((d) => d.estado === filters.estado);
    if (filters.raza) results = results.filter((d) => d.raza.toLowerCase() === filters.raza!.toLowerCase());
    if (filters.refugioId) results = results.filter((d) => d.refugioId === filters.refugioId);
    if (filters.cachorro !== null && filters.cachorro !== undefined) {
      results = filters.cachorro
        ? results.filter((d) => d.edad < 12)
        : results.filter((d) => d.edad >= 12);
    }

    return results;
  }
}

export { MOCK_DOGS };
