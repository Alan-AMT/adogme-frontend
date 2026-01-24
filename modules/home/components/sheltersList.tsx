import { getSheltersList } from "../application/sheltersList";
import { MockHomeSheltersListRepository } from "../infrastructure/MockHomeSheltersList";
import Image from "next/image";

const HomeShelterList = async () => {
  const shelters = await getSheltersList(new MockHomeSheltersListRepository());
  return (
    <section>
      <h2 className="border-b-2 mb-5 border-gray-200 text-xl font-bold">
        Refugios
      </h2>
      {shelters.map((shelter) => (
        <div key={shelter.id} className="grid md:grid-cols-3 grid-cols-2">
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl">{shelter.name}</h3>
            <p className="text-amber-700 my-1">{shelter.description}</p>
            <button className="btn btn-secondary text-black mt-2">
              Ver perros
            </button>
          </div>
          <div className="justify-items-end">
            <Image
              src={shelter.imageUrl}
              width={300}
              className="w-max"
              height={100}
              alt="Imágen del refugio"
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default HomeShelterList;
