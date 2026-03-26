// app/(public)/page.tsx
import HomeDogsList from "@/modules/home/components/dogsList";
import HeroSection from "@/modules/home/components/HeroSection";
import HomeHowItWorks from "@/modules/home/components/HowItWorksSection";
import QuickFilterChips from "@/modules/home/components/QuickFilterChips";
import HomeSheltersSection from "@/modules/home/components/SheltersCarousel";
import SuccessStoriesList from "@/modules/home/components/TestimonialsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <HeroSection />
      <QuickFilterChips />
      <div className="mx-4 my-12">
        <HomeDogsList />
      </div>
      <div className="mx-4 my-12">
        <HomeSheltersSection />
      </div>
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
