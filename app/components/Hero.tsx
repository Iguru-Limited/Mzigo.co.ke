"use client";

import React from "react";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();

  return (
    <section className="text-center px-6 py-16 bg-white">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-snug">
        Send Mzigo with ease.
        <br />
        Track every step until delivery
      </h1>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mb-10">
        <button
          onClick={() => router.push("/send-mzigo")}
          className="bg-[#2c3e50] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1a252f] transition"
        >
          Send Mzigo
        </button>

        <button
          onClick={() => router.push("/track-mzigo")}
          className="bg-[#2c3e50] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d84343] transition"
        >
          Track Mzigo
        </button>
      </div>
    </section>
  );
}

export default Hero;
