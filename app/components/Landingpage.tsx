"use client";
import React, { useState } from "react";
import CompanyCard from "./CompanyCard";

const companies = [
  {
    id: 1,
    name: "Lopha travelers ltd",
    image: "/lopha-travel-ltd.jpg",
    stages: ["Nairobi", "Ruiru", "Thika"],
    description:
      "Reliable bus services connecting Nairobi to Ruiru and Thika with comfortable and timely travel.",
  },
  {
    id: 2,
    name: "Kasese",
    image: "/kasese logo.jpeg",
    stages: ["Nairobi", "Naivasha"],
    description:
      "Efficient transport solutions from Nairobi to Naivasha, ensuring safe and quick deliveries.",
  },
  {
    id: 3,
    name: "Chania",
    image: "/Chania logo.jpeg",
    stages: ["Nairobi", "Emali", "Mombasa"],
    description:
      "Trusted partner for parcel delivery from Nairobi through Emali to Mombasa coast.",
  },
  {
    id: 4,
    name: "Kangema",
    image: "/Kangema.jpeg",
    stages: ["Nairobi", "Kangema", "Murang'a"],
    description:
      "Connecting Nairobi to Kangema and Murang'a with dependable and affordable transport services.",
  },
  {
    id: 5,
    name: "Ungwana",
    image: "/ungwana logo.jpeg",
    stages: ["Nairobi", "Embu", "Meru"],
    description:
      "Comprehensive delivery network linking Nairobi to Embu and Meru regions.",
  },
  {
    id: 6,
    name: "Metro Trans",
    image: "/metro trans.jpeg",
    stages: ["Nairobi", "Junction-mall", "Ngong-road", "Ngong"],
    description:
      "Urban and suburban transport expert, serving Nairobi and key areas like Ngong Road.",
  },
];

function Landingpage() {
  const [from, setFrom] = useState("Nairobi");
  const [to, setTo] = useState("");

  // collect all unique stages
  const allStages = Array.from(new Set(companies.flatMap((c) => c.stages)));

  // filter companies
  const filteredCompanies = companies.filter((company) => {
    if (!from && !to) return true; // show all if no filter
    const hasFrom = from ? company.stages.includes(from) : true;
    const hasTo = to ? company.stages.includes(to) : true;
    return hasFrom && hasTo;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Filter Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 
                   mb-8 p-4 bg-white shadow-md rounded-lg"
      >
        {/* From select */}
        <div className="flex items-center gap-2 text-black">
          <label className="font-bold text-black text-xl">From:</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-lg font-semibold text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Any</option>
            {allStages.map((stage, idx) => (
              <option key={idx} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* To select */}
        <div className="flex items-center gap-2 text-black">
          <label className="font-boldb text-lg">To:</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded-md font-bold px-3 py-2 text-lgb text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Any</option>
            {allStages.map((stage, idx) => (
              <option key={idx} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Companies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              companyName={company.name}
              imageSrc={company.image}
              description={company.description}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No companies found for this route.
          </p>
        )}
      </div>
    </div>
  );
}

export default Landingpage;
