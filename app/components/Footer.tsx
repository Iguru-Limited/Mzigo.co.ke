"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const partners = [
  { id: 1, name: "Chania", logo: "/Chania logo.jpeg" },
  { id: 2, name: "Kasese", logo: "/kasese logo.jpeg" },
  { id: 3, name: "Kangema", logo: "/Kangema.jpeg" },
  { id: 4, name: "Lopha travelers ltd", logo: "/lopha-travel-ltd.jpg" },
  { id: 5, name: "Ungwana", logo: "/ungwana logo.jpeg" },
  { id: 6, name: "Metro Trans", logo: "/metro trans.jpeg" },
];

function Footer() {
  const router = useRouter();

  const handleLogoClick = (partnerName: string) => {
    const companySlug = partnerName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/send-mzigo/${companySlug}`);
  };

  return (
    <footer className="bg-white py-8 mt-12">
      <div className="p-3 sm:p-4 lg:p-6 container mx-auto">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Our Partners
        </h2>
        <div className="flex justify-center flex-wrap gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="w-32 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => handleLogoClick(partner.name)}
            >
              <div className="w-32 h-32 relative">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                  sizes="(max-width: 768px) 100vw, 200px"
                  priority={false}
                  className="rounded-full"
                />
              </div>
              <span className="mt-2 text-center text-sm text-black">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
