import HeroSlider from "./components/HeroSlider";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div className="mt-[-6rem] bg-white">
      <HeroSlider />
      <FAQ />
      <Footer />
    </div>
  );
}
