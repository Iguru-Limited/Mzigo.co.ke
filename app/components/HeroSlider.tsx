"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSlider() {
  const [parcelNumber, setParcelNumber] = useState("");
  const router = useRouter();

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
              className="object-cover opacity-70" // Reduced opacity here
              priority
            />
            {/* Additional dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/parcel-hero-2.png"
              alt="Parcel Delivery 2"
              fill
              className="object-cover opacity-70" // Reduced opacity here
            />
            {/* Additional dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/receive3.jpg"
              alt="Parcel Delivery 3"
              fill
              className="object-cover opacity-70" // Reduced opacity here
            />
            {/* Additional dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Overlay Text and buttons */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          Send or Track Mzigo          
        </h1>
        

        {/* Parcel Input - Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-center mt-[10rem] mb-[-3rem] space-y-4 sm:space-y-0 sm:space-x-3 w-full max-w-2xl px-4">
         <button onClick={()=>{router.push("/send-mzigo")}} className="bg-[#2c3e50] text-white px-6 text-2xl sm:px-5 py-5 rounded-full font-bold hover:bg-gray-800 transition w-full sm:w-auto whitespace-nowrap">
            Send Mzigo →
        </button>

          <SearchBar placeholder="Enter the tracking number" />
        </div>
      </div>
    </section>
  );
}