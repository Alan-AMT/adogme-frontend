import type { DogListItem } from "../domain/dog";
import DogCard from "./dogCard";

interface DogListProps {
  dogs: DogListItem[];
}

export default function DogsList({ dogs }: DogListProps) {
  if (dogs.length === 0) {
    return (
      <div className="cat-empty">
        <p className="cat-empty__icon">🐾</p>
        <p className="cat-empty__text">No encontramos perros con esos filtros.</p>
        <p className="cat-empty__sub">Intenta ajustar tu búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="cat-grid">
      {dogs.map((dog) => (
        <DogCard key={dog.id} {...dog} />
      ))}
    </div>
  );
}
