import HeroSlider from "@/components/HeroSlider";
// import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import HomeFromTo from "@/components/HomeFromTo";

export default function Page() {
  return (
    <div className="p-3 sm:p-4 lg:p-6 container mx-auto bg-white">
      <HeroSlider />
      <HomeFromTo />
      {/* <FAQ /> */}
      <Footer />
    </div>
  );
}
