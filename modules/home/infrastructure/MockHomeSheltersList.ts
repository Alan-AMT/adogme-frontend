import { HomeSheltersListRepository } from "../domain/IHomeSheltersList";
import { ShelterCard } from "../domain/ShelterCard";

export class MockHomeSheltersListRepository implements HomeSheltersListRepository {
  public async getHomeSheltersList(): Promise<ShelterCard[]> {
    return [
      {
        id: 1,
        nombre: "Refugio Callejeritos",
        ubicacion: "Ciudad de México, Zona Norte",
        descripcion: "Un lugar seguro para perros en busca de hogar.",
        correo: "contacto@callejeritos.org",
        telefono: "+52 555-0123",
        logo: "/logos/adogme-logo.png",
        imagenPortada: "/shelter.jpg",
        fechaRegistro: "2023-05-20",
        aprobado: true,
        imageUrl: "/shelter.jpg"
      },
      {
        id: 2,
        nombre: "Huellitas de Amor",
        ubicacion: "Ciudad de México, Zona Norte",
        descripcion: "Especializados en rescate y rehabilitación de cachorros.",
        correo: "info@huellitas.mx",
        telefono: "+52 333-4567",
        logo: "/logos/adogme-logo.png",
        imagenPortada: "/shelter.jpg",
        fechaRegistro: "2023-08-12",
        aprobado: true,
        imageUrl: "/shelter.jpg"
      },
      {
        id: 3,
        nombre: "Santuario Canino",
        ubicacion: "Ciudad de México, Zona Norte",
        descripcion: "Rescate de perros de razas grandes y trabajo con conducta.",
        correo: "ayuda@santuariocanino.com",
        telefono: "+52 811-9876",
        logo: "/logos/adogme-logo.png",
        imagenPortada: "/shelter.jpg",
        fechaRegistro: "2024-01-05",
        aprobado: false,
        imageUrl: "/shelter.jpg"
      }
    ];
  }
}
