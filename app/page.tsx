import HeroSlider from "./components/HeroSlider";
import ValuePreposition from "./components/ValuePreposition";
import Importance from "./components/Importance";
export default function Page() {
  return (
    <div className="mt-[-6rem] bg-white">
      <HeroSlider />
      <ValuePreposition />
      <Importance />
    </div>
  );
}
