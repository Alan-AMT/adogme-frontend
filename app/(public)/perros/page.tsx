import DogsSearchView from "../../../modules/dogs/components/DogsSearchView";
import { parseDogsSearchParams } from "../../../modules/dogs/application/parseDogsSearchParams";

export const metadata = {
  title: "Perros en adopción | aDOGme",
  description:
    "Explora nuestra selección de perros en busca de un hogar amoroso. Filtra por tamaño, edad, energía y más.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Perros({ searchParams }: { searchParams: SearchParams }) {
  const initialFilters = parseDogsSearchParams(await searchParams);
  return (
    <div className="lg:mx-10 mx-5 py-6">
      <DogsSearchView initialFilters={initialFilters} />
    </div>
  );
}
