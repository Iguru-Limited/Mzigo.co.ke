"use client";

import React, { useState } from "react";
import { LocationSelector } from ".";

/**
 * Minimal UI-only From/To bar for the homepage.
 * Functionality (options, API integration) will be added later.
 * Always keeps From and To on the same horizontal line across all screen sizes.
 */
const HomeFromTo: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <section aria-label="Quick route selector" className="my-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-3 sm:p-4">
        <div className="flex gap-3 items-stretch">
          <div className="flex-1 min-w-0">
            <LocationSelector
              placeholder="From"
              value={from}
              onChange={setFrom}
              options={[]}
              allowFreeInput
              panel
            />
          </div>
          <div className="flex-1 min-w-0">
            <LocationSelector
              placeholder="To"
              value={to}
              onChange={setTo}
              options={[]}
              allowFreeInput
              panel
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFromTo;
