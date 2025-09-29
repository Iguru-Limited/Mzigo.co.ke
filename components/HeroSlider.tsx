"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSend } from "react-icons/fi";
import { GoPackageDependents } from "react-icons/go";

export default function HeroSlider() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[60vh] rounded-lg shadow-2xl overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/delivery.jpg"
          alt="Parcel Delivery"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-6 space-y-8">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          Send or Track Mzigo
        </h1>

        {/* Buttons */}
  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3 w-full max-w-2xl px-0 sm:px-2 box-border">
          <button
            onClick={() => {
              router.push("/send-mzigo");
            }}
            className="bg-green-600 text-white px-6 text-2xl sm:px-5 py-2 rounded-full font-bold hover:bg-green-800 transition w-full sm:w-64 flex items-center justify-center gap-2 cursor-pointer"
          >
            Send Mzigo
            <FiSend size={28} />
          </button>

          <button
            onClick={() => {
              router.push("/track-mzigo");
            }}
            className="bg-white text-black px-6 text-2xl sm:px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition w-full sm:w-64 flex items-center justify-center gap-2 cursor-pointer"
          >
            Track
            <GoPackageDependents size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
