import Filters from "@/modules/perros/components/filters";
import DogsList from "@/modules/perros/components/dogsList";

export default function Perros() {
  return (
    <div className="flex gap-5 lg:mx-10 mx-5">
      <div className="pt-5 flex-1 hidden md:block">
        <Filters />
      </div>
      <div className="pt-5 flex-4">
        <DogsList />
      </div>
    </div>
  );
}
