"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "search by company or destination",
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // TODO: Add search logic here
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-4xl mx-auto border border-gray-300 rounded-full px-3 bg-white shadow-sm
                 "
    >
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-500 
                   text-xs sm:text-sm md:text-base
                   px-2 sm:px-3"
        aria-label="Search input"
      />
      <button
        type="submit"
        className="text-gray-600 hover:text-black transition-colors p-1
                   sm:p-1.5
                   md:p-2"
        aria-label="Search"
      >
        <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
    </form>
  );
};

export default SearchBar;
