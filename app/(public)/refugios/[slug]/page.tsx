import ShelterPublicView from "@/modules/home/components/ShelterPublicView";
import { getShelterBySlug } from "@/modules/shared/mockData/shelters.mock";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const shelter = getShelterBySlug(slug);
  if (!shelter) return { title: "Refugio | aDOGme" };
  return {
    title: `${shelter.nombre} | aDOGme`,
    description: shelter.descripcion,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return <ShelterPublicView slug={slug} />;
}
