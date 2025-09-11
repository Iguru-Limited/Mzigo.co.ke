"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SearchBar from "./SearchBar";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

export default function HeroSlider() {
  const [parcelNumber, setParcelNumber] = useState("");

  return (
    <section className="relative w-full h-[80vh] rounded-lg shadow-2xl">
      {/* Image Slider with Rounded Corners */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/parcel-hero-1.png"
              alt="Parcel Delivery"
              fill
              className="object-cover"
              priority
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/parcel-hero-2.png"
              alt="Parcel Delivery 2"
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/parcel-hero-3.png"
              alt="Parcel Delivery 3"
              fill
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Overlay Text and buttons */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-6 bg-black/40">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          Send mzigo with ease
          <br />
          Track every step until delivery
        </h1>
        <p className="text-gray-200 mt-4 max-w-xl text-sm sm:text-base px-2">
          Your new parcel delivery experience – simple, accessible and reliable.
        </p>

        {/* Parcel Input - Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-3 w-full max-w-2xl px-4">          

          <button className="bg-[#2c3e50] text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition w-full sm:w-auto">
            <span className="hidden sm:inline">Send Mzogo →</span>
            <span className="sm:hidden inline">Send Mzigo →</span>
          </button>
          <SearchBar placeholder="Enter the tracking number"/>
        </div>
      </div>
    </section>
  );
}