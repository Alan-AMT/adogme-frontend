"use client";
import { Dog } from "../domain/dog";
import { useState } from "react";
import DogsList from "./dogsList";

interface DogsListCSRProps {
  initialDogs: Dog[];
}

export default function DogsListCSR({ initialDogs }: DogsListCSRProps) {
  const [dogs, setDogs] = useState(initialDogs);
  const [filters, setFilters] = useState({
    // queryText: null,
    // size: null,
    // sex: null,
    // puppy: null,
  });
  return (
    <div className="flex gap-5">
      <div className="pt-5 flex-1 hidden md:block">
        <div>
          {/* <label className="input text-amber-700 font-medium rounded-lg">
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
          </label> */}
          <div className="grid md:grid-cols-2 gap-2 mb-5">
            <input
              className="btn rounded-lg"
              type="checkbox"
              name="frameworks"
              aria-label="Pequeño"
              onClick={() => setFilters({ size: "small" })}
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
            <button className="btn bg-gray-100 rounded-xl w-full">
              Limpiar
            </button>
          </div>
        </div>
      </div>
      <div className="pt-5 flex-4">
        <h1 className="font-bold text-4xl mb-2">
          Encuentra a tu nuevo mejor amigo
        </h1>
        <p className="text-amber-700">
          Explora nuestra amplia selección de perros en busca de un hogar
          amoroso
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
        <DogsList dogs={dogs} />
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
    </div>
  );
}
