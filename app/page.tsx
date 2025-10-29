"use client";

import { useState } from "react";
import { HeroSlider, HomeFromTo } from "@/components/ui/home";
import { Footer } from "@/components/ui/shared";
import type { FilterCompanySummary, FilterResultItem } from "@/types/filter-patners";

export default function Page() {
  const [filteredCompanies, setFilteredCompanies] = useState<FilterCompanySummary[] | null>(null);

  return (
    <div className="p-3 sm:p-4 lg:p-6 container mx-auto bg-white">
      <HeroSlider />
      <HomeFromTo
        onFilter={({ companies }) => {
          setFilteredCompanies(companies || []);
        }}
      />
      <Footer filteredCompanies={filteredCompanies} />
    </div>
  );
}
