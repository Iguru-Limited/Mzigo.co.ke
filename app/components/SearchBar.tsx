"use client";

import React, { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "search by company or destination",
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tracking parcel for:", query);
    // TODO: Add tracking logic here
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-4xl mx-auto"
    >
      {/* Input Field */}
      {/* <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-full pl-4 pr-20 bg-white
                   text-gray-800 placeholder-gray-500
                   text-xs sm:text-sm md:text-base
                   py-2 sm:py-2.5 md:py-3
                   shadow-sm outline-none focus:ring-2 focus:ring-[#2c3e50]"
        aria-label="Search input"
      /> */}

      {/* Track Button inside input */}
      <button
        className="absolute right-1 top-1/2 -translate-y-1/2
                   bg-[#2c3e50] text-white font-medium rounded-full
                   px-4 py-1.5 text-xs 
                   sm:px-5 sm:py-2 sm:text-sm
                   md:px-6 md:py-2.5 md:text-base
                   hover:bg-gray-800 transition-all whitespace-nowrap"
      >
        Track
      </button>
    </form>
  );
};

export default SearchBar;
