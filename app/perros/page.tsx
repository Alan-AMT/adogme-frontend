import { getDogsList } from "@/modules/perros/application/dogsList";
import DogsListCSR from "@/modules/perros/components/dogsListCSR";
import { DogFilters } from "@/modules/perros/domain/dogFilters";
import { MockDogsList } from "@/modules/perros/infrastructure/MockDogsList";

export default async function Perros() {
  const filters: DogFilters = {
    queryText: null,
    cachorro: null,
    sexo: null,
    tamano: null,
    nivelEnergia: null,
    estado: null,
    raza: null,
    refugioId: null,
  };

  const dogs = await getDogsList(new MockDogsList(), filters);

  return (
    <div className="lg:mx-10 mx-5">
      <DogsListCSR initialDogs={dogs} />
    </div>
  );
}
