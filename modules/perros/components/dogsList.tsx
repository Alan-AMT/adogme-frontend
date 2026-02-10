import { Dog } from "../domain/dog";
import DogCard from "./dogCard";

interface DogListProps {
  dogs: Dog[];
}

export default function DogsList({ dogs }: DogListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {dogs.map((dog) => (
        <DogCard
          key={dog.name}
          imageUrl={dog.imageUrl}
          name={dog.name}
          shelterName={dog.shelterName}
          age={dog.age}
        />
      ))}
    </div>
  );
}
