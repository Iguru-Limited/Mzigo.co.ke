"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import { usePartners } from "@/hooks";

function Footer() {
  const router = useRouter();
  const { partners, loading } = usePartners();

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
        {loading ? (
          <div className="flex justify-center flex-wrap gap-8" aria-busy>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-32 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                <div className="mt-2 h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center flex-wrap gap-8">
            {partners.map((partner) => (
              <div
                key={partner.id as React.Key}
                className="w-32 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => handleLogoClick(partner.name)}
              >
                <div className="w-32 h-32 relative flex items-center justify-center">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                      sizes="(max-width: 768px) 100vw, 200px"
                      priority={false}
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={partner.name}
                      round={true}
                      size="128"
                      color="#12FF6B"
                      fgColor="#ffffff"
                    />
                  )}
                </div>
                <span className="mt-2 text-center text-sm text-black">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
