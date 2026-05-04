import ShelterPublicView from "@/modules/home/components/ShelterPublicView";
import { getShelterById } from "@/modules/shared/mockData/shelters.mock";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const shelter = getShelterById(id);
  if (!shelter) return { title: "Refugio | aDOGme" };
  return {
    title: `${shelter.nombre} | aDOGme`,
    description: shelter.descripcion,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  return <ShelterPublicView id={id} />;
}
