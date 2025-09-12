"use client";

import React, { useState } from "react";
import Image from "next/image";

const partners = [
  { id: 1, name: "Chania", logo: "/Chania logo.jpeg" },
  { id: 2, name: "Kasese", logo: "/kasese logo.jpeg" },
  { id: 3, name: "Kangema", logo: "/Kangema.jpeg" },
  { id: 4, name: "Lopha travelers ltd", logo: "/lopha-travel-ltd.jpg" },
  { id: 5, name: "Ungwana", logo: "/ungwana logo.jpeg" },
  { id: 6, name: "Metro Trans", logo: "/metro trans.jpeg" },
];

function Footer() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <footer className="bg-white py-8 mt-12">
      <h2 className="text-2xl font-bold text-center text-black mb-6">Our Partners</h2>
      <div className="flex justify-center flex-wrap gap-8">
        {partners.map((partner, index) => (
          <div
            key={partner.id}
            className="w-32 h-32 flex flex-col items-center justify-center relative group"
            onClick={() => setActiveIndex(index === activeIndex ? null : index)}
            onBlur={() => setActiveIndex(null)}
            tabIndex={0}
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              style={{ objectFit: "cover", borderRadius: "50%" }}
              sizes="(max-width: 768px) 100vw, 200px"
              priority={false}
              className="rounded-full"
            />
            <span className="sr-only">{partner.name}</span>
            {/* Show name below logo on mobile or when clicked */}
            <div
              className={`mt-2 text-center text-sm font-medium text-gray-700 ${
                activeIndex === index ? "block" : "hidden"
              } md:hidden`}
            >
              {partner.name}
            </div>
            {/* Show name on hover for desktop */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap hidden md:block">
              {partner.name}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
