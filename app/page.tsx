// page.tsx
import HomeDogsList from "@/modules/home/components/dogsList";
import HeroCarousel from "@/modules/home/components/HeroCarousel";
import HomeHowItWorks from "@/modules/home/components/HomeHowItWorks";
import HomeSheltersSection from "@/modules/home/components/sheltersList";
import SuccessStoriesList from "@/modules/home/components/successStories";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <HeroCarousel />

      <div className="mx-4 my-12">
        <HomeDogsList />
      </div>

      <div className="mx-4 my-12">
        <HomeSheltersSection />
      </div>

      {/* Movido aquí para que aparezca después de los pasos */}
      <div className="mx-4 my-12">
        <HomeHowItWorks />
      </div>

      <div className="mx-4 my-12">
        <SuccessStoriesList />
      </div>

      <div className="pb-12" />
    </div>
  );
}
