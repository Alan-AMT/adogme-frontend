import Image from "next/image";
import { getHomeDogsList } from "../application/dogsList";
import { MockHomedogsListRepository } from "../infrastructure/MockDogsList";

const HomeDogsList = async () => {
  //Can use try catch or let nextJs erros.tsx be shown to client
  const dogs = await getHomeDogsList(new MockHomedogsListRepository());
  return (
    <section>
      <h2 className="border-b-2 mb-5 border-gray-200 text-xl font-bold">
        Perros
      </h2>
      <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 justify-center">
        {dogs.map((dog) => (
          <div key={dog.id}>
            <Image
              src={dog.imageUrl}
              className="rounded-2xl brightness-90 w-12/12"
              width={300}
              height={100}
              alt="Perro"
            />
            <h3 className="font-bold text-xl mt-3">{dog.name}</h3>
            <p className="text-amber-700">{dog.description}</p>
          </div>
        ))}
      </div>
      <div className="my-10 flex justify-center">
        <button className="btn btn-primary">Ver detalles</button>
      </div>
    </section>
  );
};

export default HomeDogsList;
