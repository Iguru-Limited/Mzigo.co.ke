import React from 'react';
import Logo from './logo.jpg';
import { MdAccountCircle } from "react-icons/md";
import Image from 'next/image';

function Header() {
  return (
    <div className="bg-white drop-shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto">
        
        {/* Logo */}
        <div>
          <Image 
            src={Logo}
            alt="logo"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain cursor-pointer"
          />
        </div>
        
        {/* Account Icon */}
        <div>
          <MdAccountCircle className="text-4xl sm:text-4xl md:text-5xl text-gray-700 cursor-pointer" />
        </div>
      </header>
    </div>
  );
}

export default Header;
