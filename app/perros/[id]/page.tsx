import Image from "next/image";
import Link from "next/link";
import ShelterBanner from "@/modules/perro/components/shelterBanner";

export default function PerrosId() {
  return (
    <div className="p-3 md:p-5">
      <div className="md:flex gap-6 lg:gap-10">
        <div className="md:flex-2/5">
          <div className="font-semibold">
            <span className="text-amber-700 hover:opacity-65">
              <Link href="/">Inicio</Link>
            </span>
            <span className="text-amber-700"> / </span>
            <span className="text-amber-700 hover:opacity-65">
              <Link href="/perros">Buscar perros</Link>
            </span>
            <span> / </span>
            <span>Buddy</span>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src={"/adoptionStory1.jpg"}
              width={300}
              className="w-full h-full rounded-xl"
              height={1000}
              alt="Fotografía perfil perro"
            />
          </div>
        </div>
        <div className="md:flex-3/5">
          <h1 className="text-4xl font-black mb-3">Buddy</h1>
          <p className="text-amber-700">Raza/mezcla - 2 años - Macho</p>
          <div className="my-5">
            <p className="text-xl font-bold">85%</p>
            <p className="text-amber-700">Basado en tu perfil...</p>
            <input
              className="btn btn-success rounded-3xl font-bold mt-3 md:mt-5 text-white"
              type="checkbox"
              name="frameworks"
              aria-label="Adoptar a Buddy"
            />
          </div>
          <div className="gap-3 md:my-7 my-3">
            <input
              className="btn rounded-3xl font-bold my-2 mr-2"
              readOnly={true}
              checked={false}
              type="checkbox"
              name="frameworks"
              aria-label="Juguetón"
            />
            <input
              className="btn rounded-3xl font-bold my-2 mr-2"
              readOnly={true}
              checked={false}
              type="checkbox"
              name="frameworks"
              aria-label="Esterilizado"
            />
            <input
              className="btn rounded-3xl font-bold my-2 mr-2"
              readOnly={true}
              checked={false}
              type="checkbox"
              name="frameworks"
              aria-label="Bueno con niños"
            />
            <input
              className="btn rounded-3xl font-bold my-2 mr-2"
              readOnly={true}
              checked={false}
              type="checkbox"
              name="frameworks"
              aria-label="Energía alta"
            />
          </div>
          <h2 className="text-2xl font-bold">Sobre mí</h2>
          <p className="my-2">
            Buddy es un golden retriever de 2 años, lleno de energía y amor para
            dar. Es juguetón, bueno con niõs y está esterilizado. Busca un hogar
            donde pueda correr, jugar y ser parte de la familia
          </p>
          <div className="my-3 md:my-5">
            <ShelterBanner />
          </div>
          <div className="my-3 md:my-5">
            <ShelterBanner />
          </div>
          <p className="text-amber-700">Estado: Disponible</p>
        </div>
      </div>
      <div className="flex justify-between lg:max-w-2/5 md:max-w-2/5 mt-5">
        <input
          className="btn rounded-3xl font-bold"
          type="checkbox"
          readOnly={true}
          checked={false}
          name="frameworks"
          aria-label="Compartir"
        />
        <input
          className="btn rounded-3xl font-bold"
          type="checkbox"
          readOnly={true}
          checked={false}
          name="frameworks"
          aria-label="Reportar"
        />
      </div>
    </div>
  );
}
