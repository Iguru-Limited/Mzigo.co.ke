"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";

type PartnerItem = { id: string | number; name: string; logo?: string };

function Footer() {
  const router = useRouter();
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let abort = false;
    const load = async () => {
      try {
        console.time("footer:fetch-partners");
        console.log("[footer] Fetching partners...");
        const res = await fetch("/api/partners", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const parsed: PartnerItem[] = Array.isArray(json?.partners)
          ? json.partners
          : [];
        if (!abort) {
          setItems(parsed);
        }
        console.log(`[footer] Partners loaded: ${parsed.length}`);
      } catch (e) {
        console.error("[footer] Failed to load partners", e);
        if (!abort) setItems([]);
      } finally {
        if (!abort) setLoading(false);
        console.timeEnd("footer:fetch-partners");
      }
    };
    load();
    return () => {
      abort = true;
    };
  }, []);

  const partners = useMemo(() => items, [items]);

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
