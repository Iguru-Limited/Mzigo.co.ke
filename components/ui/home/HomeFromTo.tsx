"use client";

import React, { useEffect, useState } from "react";
import { LocationSelector } from ".";
import { useDestinations } from "@/hooks";
import { useFilterPartners } from "@/hooks";
import type { FilterCompanySummary, FilterResultItem } from "@/types/filter-patners";

/**
 * Minimal UI-only From/To bar for the homepage.
 * Functionality (options, API integration) will be added later.
 * Always keeps From and To on the same horizontal line across all screen sizes.
 */
type HomeFromToProps = {
  onFilter?: (payload: {
    results: FilterResultItem[];
    companies: FilterCompanySummary[];
    count: number;
    message?: string | null;
  }) => void;
};

const HomeFromTo: React.FC<HomeFromToProps> = ({ onFilter }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { destinations, loading: loadingDest } = useDestinations();
  const {
    results,
    companies,
    count,
    message,
    loading: loadingFilter,
    error,
    filterPartners,
    reset,
  } = useFilterPartners();

  const options = destinations.map((d) => d.name);

  // When internal filter state updates after a request, notify parent
  useEffect(() => {
    if (onFilter && (results.length || companies.length)) {
      onFilter({ results, companies, count, message });
    }
  }, [results, companies, count, message, onFilter]);

  return (
    <section aria-label="Quick route selector" className="my-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Select route to filter partners</span>
          <button
            type="button"
            className="text-xs text-pink-600 hover:text-pink-700 underline"
            onClick={() => {
              setFrom("");
              setTo("");
              reset();
              onFilter?.({ results: [], companies: [], count: 0, message: null });
            }}
          >
            Clear filter
          </button>
        </div>
        <div className="flex gap-3 items-stretch">
          <div className="flex-1 min-w-0">
            <LocationSelector
              placeholder="From"
              value={from}
              onChange={async (val) => {
                // Avoid duplicate calls if the value didn't change
                if (val === from) return;
                setFrom(val);
                // Trigger filter as soon as a From is selected
                await filterPartners({ from_town: val || undefined, to_town: to || undefined });
              }}
              options={options}
              allowFreeInput={false}
              panel
            />
          </div>
          <div className="flex-1 min-w-0">
            <LocationSelector
              placeholder="To"
              value={to}
              onChange={async (val) => {
                if (val === to) return;
                setTo(val);
                // Trigger filter as soon as a To is selected
                await filterPartners({ from_town: from || undefined, to_town: val || undefined });
              }}
              options={options}
              allowFreeInput={false}
              panel
            />
          </div>
        </div>
        {(loadingDest || loadingFilter) && (
          <p className="mt-2 text-xs text-gray-500">Loading suggestions{loadingFilter ? ' & results' : ''}…</p>
        )}
        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
};

export default HomeFromTo;
