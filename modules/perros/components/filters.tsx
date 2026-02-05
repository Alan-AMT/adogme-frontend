export default function Filters() {
  return (
    <div>
      <div className="">
        <label className="input text-amber-700 font-medium rounded-lg">
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
            placeholder="Colonia o alcaldia"
          />
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-2 my-5">
        <input
          className="btn rounded-lg"
          type="checkbox"
          name="frameworks"
          aria-label="Pequeño"
        />
        <input
          className="btn rounded-lg"
          type="checkbox"
          name="frameworks"
          aria-label="Mediano"
        />
        <input
          className="btn rounded-lg"
          type="checkbox"
          name="frameworks"
          aria-label="Grande"
        />
      </div>
      <div className="flex gap-2 justify-between">
        <input
          className="btn rounded-lg flex-1"
          type="checkbox"
          name="frameworks"
          aria-label="Cachorro"
        />
        <p className="my-auto">ó</p>
        <input
          className="btn rounded-lg flex-1"
          type="checkbox"
          name="frameworks"
          aria-label="Adulto"
        />
      </div>
      <div className="flex gap-3 my-5">
        <input type="checkbox" className="checkbox checkbox-primary" />
        <p>Machos</p>
      </div>
      <div className="flex gap-3">
        <input type="checkbox" className="checkbox checkbox-primary" />
        <p>Hembras</p>
      </div>
      <div className="mt-5">
        <button className="btn btn-primary rounded-xl w-full mb-3">
          Aplicar filtros
        </button>
        <button className="btn bg-gray-100 rounded-xl w-full">Limpiar</button>
      </div>
    </div>
  );
}
