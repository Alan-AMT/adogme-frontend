import Image from "next/image";
import Link from "next/link";
import { Dog } from "../domain/dog";

export default function DogCard({ name, shelterName, imageUrl }: Dog) {
  return (
    <Link href={"/perros/19"}>
      <Image
        src={imageUrl}
        width={300}
        className="w-max rounded-xl"
        height={100}
        alt="Fotografía portada perro"
      />
      <h1 className="font-bold mt-2">{name}</h1>
      <p className="text-amber-700">{shelterName}</p>
    </Link>
  );
}
