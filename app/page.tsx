import Image from "next/image";
import HomeDogsList from "@/modules/home/components/dogsList";
import HomeShelterList from "@/modules/home/components/sheltersList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="flex justify-center md:my-10 my-3 relative p-1 md:p-3">
        <Image
          src="/dog1.jpg"
          className="rounded-2xl brightness-75"
          width={800}
          height={500}
          alt="Perro portada"
        />
        {/* <img src="/dog1.jpg" /> */}
        <div className="absolute top-10 md:top-32 lg:top-48 text-center md:px-3">
          <h1 className="text-5xl font-black text-white">
            Encuentra a tu compañero ideal
          </h1>
          <p className="text-white md:my-5">
            Adopta un perro en Gustavo A. Madero y cambia una vida.
          </p>
          <div className="flex gap-3 justify-center md:mt-10 mt-5">
            <Link href="./perros">
              <button className="btn btn-primary">Explorar perros</button>
            </Link>
            <button className="btn btn-secondary text-black">
              Cómo funciona
            </button>
          </div>
        </div>
      </main>
      <div className="lg:mx-10 mx-5">
        <HomeDogsList />
      </div>
      <div className="lg:mx-10 mx-5">
        <HomeShelterList />
      </div>
      <section className="lg:mx-10 mx-5" id="proceso">
        <h3 className="text-xl font-bold my-5 md:my-9">Cómo funciona?</h3>
        <h2 className="text-3xl font-black">En 3 simples pasos</h2>
        <div className="my-5 grid grid-cols-3 gap-2 mx-auto max-w-5xl">
          <div className="border-2 rounded-xl p-3 border-gray-200">
            <span className="material-symbols-outlined">search</span>
            <p className="font-bold">Explora</p>
            <p className="text-amber-700">
              Descubre perros en refugios de Gustavo A. Madero
            </p>
          </div>
          <div className="border-2 rounded-xl p-3 border-gray-200">
            <span className="material-symbols-outlined">home</span>
            <p className="font-bold">Encuesta</p>
            <p className="text-amber-700">
              Rellena el formulario de estilo de vida
            </p>
          </div>
          <div className="border-2 rounded-xl p-3 border-gray-200">
            <span className="material-symbols-outlined">favorite</span>
            <p className="font-bold">Adopta</p>
            <p className="text-amber-700">
              Llena la solicitud y lleva a tu nuevo amigo a casa
            </p>
          </div>
        </div>
      </section>
      <section className="lg:mx-10 mx-5 my-5 md:my-10">
        <h2 className="text-2xl font-black">Historias de éxito</h2>
        <div className="grid justify-items-center grid-cols-2 md:grid-cols-3 gap-3 my-5">
          <div>
            <Image
              src={"/adoptionStory1.jpg"}
              width={500}
              className="my-2 w-max mx-auto"
              height={800}
              alt="Caso de éxito"
            />
            <p className="font-bold text-lg">La historia de Sofía y Max</p>
            <p className="text-amber-700">
              Max encontró un hogar lleno de amor con Sofía.
            </p>
          </div>
          <div>
            <Image
              src={"/adoptionStory1.jpg"}
              width={500}
              className="my-2 w-max mx-auto"
              height={800}
              alt="Caso de éxito"
            />
            <p className="font-bold text-lg">La historia de Carlos y Bella</p>
            <p className="text-amber-700">
              Bella se adaptó rapidamente a su nueva familia.
            </p>
          </div>
          <div>
            <Image
              src={"/adoptionStory1.jpg"}
              width={500}
              className="my-2 w-max mx-auto"
              height={800}
              alt="Caso de éxito"
            />
            <p className="font-bold text-lg">La historia de Ana y Rocky</p>
            <p className="text-amber-700">
              Rocky ahora disfruta de largas caminatas con Ana.
            </p>
          </div>
        </div>
      </section>
      <footer className="text-amber-700 text-lg flex flex-col gap-5 my-5">
        <div className="flex justify-center lg:gap-x-52 md:gap-x-40 gap-3">
          <a>Producto</a>
          <a>Legal</a>
          <a>Contacto</a>
        </div>
        <div className="flex justify-center gap-3">
          <span className="material-symbols-outlined">copyright</span>
          <span className="material-symbols-outlined">copyright</span>
          <span className="material-symbols-outlined">copyright</span>
        </div>
        <div className="flex gap-1 justify-center">
          <span className="material-symbols-outlined">copyright</span>
          <p>2026 aDOGme. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
