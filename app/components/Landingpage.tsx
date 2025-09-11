import React from "react";
import CompanyCard from "./CompanyCard";

const companies = [
  {
    id: 1,
    name: "Lopha travelers ltd",
    image: "/lopha-travel-ltd.jpg",
    stages: [
      "nairobi",
      "ruiru",
      "thika",
    ],
  },
  {
    id: 2,
    name: "Kasese",
    image: "/kasese logo.jpeg",
    stages: [
      "Nairobi",
      "Naivasha",
    ],
  },
  {
    id: 3,
    name: "Chania",
    image: "/Chania logo.jpeg",
    stages: [
      "Nairobi",
      "Emali",
      "Mombasa",
    ],
  },
  {
    id: 4,
    name: "Kangema",
    image: "/Kangema.jpeg",
    stages: [
      "Nairobi",
      "kangema",
      "Murang'a",
    ],
  },
  {
    id: 5,
    name: "Ungwana",
    image: "/ungwana logo.jpeg",
    stages: [
      "Nairobi",
      "Embu",
      "Meru",
    ],
  },
  {
    id: 6,
    name: "Metro Trans",
    image: "/metro trans.jpeg",
    stages: [
      "Nairobi",
      "Junction-mall",
      "Ngong-road",
      "Ngong",
    ],
  },
];

function Landingpage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            companyName={company.name}
            imageSrc={company.image}
            stages={company.stages}
          />
        ))}
      </div>
    </div>
  );
}

export default Landingpage;
