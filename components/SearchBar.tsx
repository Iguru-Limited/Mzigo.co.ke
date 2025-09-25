"use client";

import React, { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Enter tracking number",
  onSearch,
  value,
  onChange,
}) => {
  const [internalQuery, setInternalQuery] = useState("");
  
  const currentValue = value !== undefined ? value : internalQuery;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalQuery(newValue);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(currentValue);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Track Your Parcel
        </h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={currentValue}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-300 rounded-full pl-6 pr-32 bg-white
                       text-black placeholder-gray-500
                       text-sm md:text-base
                       py-3 md:py-4
                       shadow-sm outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400
                       transition-all duration-200"
            aria-label="Tracking number input"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2
                       bg-green-600 text-white font-semibold rounded-full
                       px-6 py-2 md:px-8 md:py-3 text-sm md:text-base
                       hover:bg-green-700 transition-all duration-200 
                       shadow-md hover:shadow-lg whitespace-nowrap
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Track Parcel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
