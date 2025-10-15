import { HeroSlider, HomeFromTo } from "@/components/ui/home";
import { Footer } from "@/components/ui/shared";

export default function Page() {
  return (
    <div className="p-3 sm:p-4 lg:p-6 container mx-auto bg-white">
      <HeroSlider />
      <HomeFromTo />
      <Footer />
    </div>
  );
}
