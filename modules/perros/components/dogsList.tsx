import DogCard from "./dogCard";

export default function DogsList() {
  return (
    <div>
      <h1 className="font-bold text-4xl mb-2">
        Encuentra a tu nuevo mejor amigo
      </h1>
      <p className="text-amber-700">
        Explora nuestra amplia selección de perros en busca de un hogar amoroso
      </p>
      <div className="min-w-full mt-5">
        <label className="input text-amber-700 font-medium rounded-lg bg-neutral-100 min-w-full">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Busca por nombre, raza..."
          />
        </label>
      </div>
      <div className="mt-5">
        <p className="font-bold">Resultados (8)</p>
        <div className="my-3">
          <form className="flex gap-3">
            <input
              className="btn rounded-lg"
              type="checkbox"
              name="frameworks"
              aria-label="Relevancia"
            />
            <input
              className="btn rounded-lg"
              type="checkbox"
              name="frameworks"
              aria-label="Más recientes"
            />
            <input
              className="btn rounded-lg"
              type="checkbox"
              name="frameworks"
              aria-label="Edad"
            />
            {/* <input className="btn btn-square" type="reset" value="×" /> */}
          </form>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <DogCard />
        <DogCard />
        <DogCard />
        <DogCard />
        <DogCard />
        <DogCard />
        <DogCard />
      </div>
      <div className="flex justify-center my-10 md:my-15">
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn">1</button>
          <button className="join-item btn">2</button>
          <button className="join-item btn btn-disabled">...</button>
          <button className="join-item btn">9</button>
          <button className="join-item btn">10</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
    </div>
  );
}
