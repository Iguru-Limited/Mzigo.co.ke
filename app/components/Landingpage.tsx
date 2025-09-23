"use client";
import React, { useEffect, useMemo, useState } from "react";
import CompanyCard from "./CompanyCard";

type PartnerItem = { id: string | number; name: string; logo?: string };

function Landingpage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let abort = false;
    const load = async () => {
      try {
        console.time("landing:fetch-partners");
        const res = await fetch("/api/partners", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const parsed: PartnerItem[] = Array.isArray(json?.partners)
          ? json.partners
          : [];
        if (!abort) setPartners(parsed);
      } catch (e) {
        console.error("[landing] Failed to load partners", e);
        if (!abort) setPartners([]);
      } finally {
        if (!abort) setLoading(false);
        console.timeEnd("landing:fetch-partners");
      }
    };
    load();
    return () => {
      abort = true;
    };
  }, []);

  const data = useMemo(() => partners, [partners]);

  return (
    <div className="p-3 sm:p-4 lg:p-6 container mx-auto">
      {/* Filter Form */}   

      {/* Companies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="w-full h-52 bg-gray-200 rounded-lg animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))
        ) : data.length > 0 ? (
          data.map((p) => (
            <CompanyCard
              key={p.id}
              companyName={p.name}
              imageSrc={p.logo}
              description={""}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No partners found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Landingpage;
