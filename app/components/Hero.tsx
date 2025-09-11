"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroSlider from "./HeroSlider";
function Hero() {
  const router = useRouter();

  return (
    <section className="text-center px-6 py-16 bg-white">
     

      {/* slider */}
      <HeroSlider />
    </section>
  );
}

export default Hero;
