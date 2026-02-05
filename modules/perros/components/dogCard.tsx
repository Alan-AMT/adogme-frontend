import Image from "next/image";

export default function DogCard() {
  return (
    <div>
      <Image
        src={"/dog1.jpg"}
        width={300}
        className="w-max rounded-xl"
        height={100}
        alt="Fotografía portada perro"
      />
      <h1 className="font-bold mt-2">Max</h1>
      <p className="text-amber-700">Refugio Patitas GAM</p>
    </div>
  );
}
