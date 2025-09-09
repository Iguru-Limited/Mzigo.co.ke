'use client';

import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'search by company or destination' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // TODO: Add search logic here
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm"
    >
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm"
      />
      <button
        type="submit"
        className="text-gray-600 hover:text-black transition-colors"
        aria-label="Search"
      >
        <FiSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
