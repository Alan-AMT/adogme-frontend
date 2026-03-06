import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dogService } from "../../../../modules/dogs/infrastructure/DogServiceFactory";
import DogDetailView from "../../../../modules/dogs/components/DogDetailView";

type Props = { params: Promise<{ slug: string }> };

// ── SEO dinámico ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dog = await dogService.getDogBySlug(slug);

  if (!dog) {
    return { title: "Perro no encontrado | aDOGme" };
  }

  const edadLabel =
    dog.edad < 12
      ? `${dog.edad} ${dog.edad === 1 ? "mes" : "meses"}`
      : `${Math.floor(dog.edad / 12)} ${Math.floor(dog.edad / 12) === 1 ? "año" : "años"}`;

  const title = `${dog.nombre} — ${dog.raza} en adopción | aDOGme`;
  const description =
    `Conoce a ${dog.nombre}, un ${dog.raza} de ${edadLabel}` +
    (dog.refugioCiudad ? ` en ${dog.refugioCiudad}` : "") +
    `. ${dog.descripcion.slice(0, 120)}…`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: dog.foto ? [{ url: dog.foto, width: 800, height: 600, alt: dog.nombre }] : [],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DogDetail({ params }: Props) {
  const { slug } = await params;
  const dog = await dogService.getDogBySlug(slug);

  if (!dog) notFound();

  return <DogDetailView dog={dog} />;
}
