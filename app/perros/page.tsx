// "use client";
import DogsList from "@/modules/perros/components/dogsList";
import { getDogsList } from "@/modules/perros/application/dogsList";
import { MockDogsList } from "@/modules/perros/infrastructure/MockDogsList";
import { DogFilters } from "@/modules/perros/domain/dogFilters";
import DogsListCSR from "@/modules/perros/components/dogsListCSR";
// import { useState } from "react";

export default async function Perros() {
  const filters: DogFilters = {
    queryText: null,
    puppy: null,
    sex: null,
    size: null,
  };
  const dogs = await getDogsList(new MockDogsList(), filters);
  return (
    <div className="lg:mx-10 mx-5">
      <DogsListCSR initialDogs={dogs} />
    </div>
  );
}
