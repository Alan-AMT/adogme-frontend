import SheltersListView from "@/modules/home/components/SheltersListView";

export const metadata = {
  title: "Refugios aliados | aDOGme",
  description:
    "Explora los refugios de perros en México que trabajan con aDOGme. Filtra por ciudad y encuentra el refugio más cercano.",
};

export default function Page() {
  return <SheltersListView />;
}
