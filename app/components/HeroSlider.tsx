"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSlider() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[80vh] rounded-lg shadow-2xl">
      {/* Single Image with Rounded Corners */}
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Image
          src="/parcel-hero-1.png"
          alt="Parcel Delivery"
          fill
          className="object-cover opacity-70" // Reduced opacity here
          priority
        />
        {/* Additional dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Overlay Text and buttons */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          Send or Track Mzigo
        </h1>

        {/* Buttons - Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-center mt-[10rem] mb-[-3rem] space-y-4 sm:space-y-0 sm:space-x-3 w-full max-w-2xl px-4">
          <button
            onClick={() => {
              router.push("/send-mzigo");
            }}
            className="bg-[#2c3e50] text-white px-6 text-2xl sm:px-5 py-2 rounded-full font-bold hover:bg-gray-800 transition w-full sm:w-64 whitespace-nowrap"
          >
            Send Mzigo →
          </button>

          <button
            onClick={() => {
              router.push("/track-mzigo");
            }}
            className="bg-[#2c3e50] text-white px-6 text-2xl sm:px-5 py-2 rounded-full font-bold hover:bg-gray-800 transition w-full sm:w-64 whitespace-nowrap"
          >
            Track
          </button>
        </div>
      </div>
    </section>
  );
}
