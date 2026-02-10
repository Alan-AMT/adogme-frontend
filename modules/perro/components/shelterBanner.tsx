import Image from "next/image";
import Link from "next/link";

export default function ShelterBanner() {
  return (
    <div className="grid md:grid-cols-3 grid-cols-2">
      <div className="md:col-span-2">
        <h3 className="font-bold text-xl">Refugio Amigos Peludos</h3>
        <p className="text-amber-700 my-1">
          Ubicación: Gustavo A. Madero, CDMX
        </p>
        <Link href={"/refugios/22"}>
          <input
            className="btn rounded-3xl font-bold my-2 mr-2"
            readOnly={true}
            checked={false}
            type="checkbox"
            name="frameworks"
            aria-label="Ver perfil del refugio"
          />
        </Link>
      </div>
      <div className="justify-items-end">
        <Image
          src={"/dog1.jpg"}
          width={300}
          className="w-max"
          height={100}
          alt="Imágen del refugio"
        />
      </div>
    </div>
  );
}
