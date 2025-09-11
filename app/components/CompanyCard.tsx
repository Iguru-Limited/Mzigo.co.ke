'use client';

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";

interface CompanyCardProps {
  companyName: string;
  imageSrc: string | StaticImageData;
  stages: string[];
}

function CompanyCard({ companyName, imageSrc, stages }: CompanyCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-md 
                 flex flex-col items-start transform transition duration-300 ease-in-out 
                 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Company Name */}
      <h3 className="font-bold mb-2 text-lg text-left w-full text-black">
        {companyName}
      </h3>

      {/* Image */}
      <div className="w-full rounded-lg overflow-hidden mb-2 relative">
        <Image
          src={imageSrc}
          alt={companyName}
          width={500}
          height={200}
          className="w-full h-36 object-cover rounded-lg"
        />

        {/* Like Button */}
        <button
          onClick={toggleLike}
          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full text-red-500 hover:scale-110 transition-transform"
          aria-label="Like"
        >
          {liked ? <AiFillHeart size={20} /> : <FiHeart size={20} />}
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-2">
        <button className="bg-[#2c3e50] text-white text-xs px-3 py-1 rounded-full hover:bg-blue-800 transition">
          Send
        </button>
        <button className="bg-[#2c3e50] text-white text-xs px-3 py-1 rounded-full hover:bg-red-600 transition">
          Track
        </button>
      </div>

      {/* Stages */}
      <div className="text-sm text-gray-700 w-full">
        <p className="font-semibold">Stages we deliver:</p>
        <ul className="list-disc list-inside">
          {stages.map((stage, idx) => (
            <li key={idx}>{stage}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CompanyCard;
