'use client';
import React from "react";
import { MdAccountCircle } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Header() {
  const router =  useRouter();
  return (
    <div className="bg-white drop-shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto">
        {/* Logo */}
        <div onClick={() => router.push('/')} className="cursor-pointer">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={64}
            height={64}
            className="h-12 sm:h-14 md:h-16 w-auto object-contain cursor-pointer"
          />
        </div>
        

        {/* Account Icon */}
        <div className="flex items-center space-x-4">
          <button
          className="bg-[#2c3e50] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d84343] transition"
        >
          a btn1
        </button>
          <MdAccountCircle className="text-4xl sm:text-4xl md:text-5xl text-gray-700 cursor-pointer" />          
        </div>
      </header>
    </div>
  );
}

export default Header;
