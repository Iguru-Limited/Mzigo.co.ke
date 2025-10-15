"use client";
import React from "react";
import { CompanyCard } from "../send-mzigo";
import { usePartners } from "@/hooks";

function Landingpage() {
  const { partners, loading, error } = usePartners();

  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 container mx-auto">
        <div className="text-center text-red-600 py-8">
          <p>Failed to load partners: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 container mx-auto">
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
        ) : partners.length > 0 ? (
          partners.map((p) => (
            <CompanyCard
              key={p.id}
              companyName={p.name}
              imageSrc={p.logo}
              description={""}
              companyId={p.id}
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
