"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";

interface CompanyCardProps {
  companyName: string;
  imageSrc?: string | StaticImageData;
  description?: string;
  companyId?: string | number;
}

function CompanyCard({ companyName, imageSrc, description, companyId }: CompanyCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSendClick = () => {
    const companySlug = companyName.toLowerCase().replace(/\s+/g, "-");
    const query = companyId != null ? `?company_id=${encodeURIComponent(String(companyId))}` : "";
    router.push(`/send-mzigo/${companySlug}${query}`);
  };
  const handleTrackClick =  () =>{
    router.push('/track-mzigo')
  }

  return (
    <div
      className="border border-gray-300 rounded-lg p-3 sm:p-4 lg:p-6 container mx-auto bg-white shadow-md 
                 flex flex-col items-start transform transition duration-300 ease-in-out 
                 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Company Name */}
      <h3 className="font-bold mb-2 text-lg text-left w-full text-black">
        {companyName}
      </h3>

      {/* Image Section */}
      <div className="w-full rounded-lg overflow-hidden mb-2 relative flex items-center justify-center bg-gray-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={companyName}
            width={500}
            height={200}
            className="w-full h-52 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-52">
            <Avatar
              name={companyName}
              round={false}
              size="100%"
              color="#12FF6B"
              fgColor="#ffffff"
              className="rounded-lg"
            />
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-3 rounded-full text-red-500 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Like"
        >
          {liked ? <AiFillHeart size={26} /> : <FiHeart size={26} />}
        </button>

        {/* Overlay Buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
          <button
            onClick={handleSendClick}
            className="bg-green-600 text-white font-semibold text-lg px-7 py-3 rounded-full shadow-lg 
                       hover:bg-green-900 transition transform hover:scale-110 cursor-pointer"
          >
            Send
          </button>
          <button onClick={handleTrackClick}
            className="bg-green-600 text-white font-semibold text-lg px-7 py-3 rounded-full shadow-lg 
                       hover:bg-green-900 transition transform hover:scale-110 cursor-pointer"
          >
            Track
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-700 w-full">
        <p>{description ?? "Trusted logistics partner"}</p>
      </div>
    </div>
  );
}

export default CompanyCard;
