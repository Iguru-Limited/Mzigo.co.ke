import React from "react";
import Image from "next/image";

interface CompanyCardProps {
  companyName: string;
  imageSrc: string;
  description: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  companyName,
  imageSrc,
  description,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md flex flex-col items-start">
      {/* Company Name */}
      <h3 className="font-bold mb-2 text-lg text-left w-full">{companyName}</h3>

      {/* Image */}
      <div className="w-full rounded-lg overflow-hidden mb-2">
        <Image
          src={imageSrc}
          alt={companyName}
          width={500} // ✅ must specify width and height in next/image
          height={200}
          className="w-full h-36 object-cover rounded-lg"
        />
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

      {/* Description */}
      <p className="text-sm text-gray-600 lowercase">{description}</p>
    </div>
  );
};

export default CompanyCard;
