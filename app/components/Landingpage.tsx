import React from "react";
import CompanyCard from "./CompanyCard";

const companies = [
  {
    id: 1,
    name: "Lopha travelers ltd",
    image: "/lopha-travel-ltd.jpg",
    description: "we deliver all places in nairobi,ruiru, thika",
  },
  {
    id: 2,
    name: "Kasese",
    image: "/kasese logo.jpeg",
    description: "we deliver from nairobi to naivasha",
  },
  {
    id: 3,
    name: "Chania",
    image: "/Chania logo.jpeg",
    description: "we deliver all places in nairobi",
  },
  {
    id: 4,
    name: "Kangema",
    image: "/Kangema.jpeg",
    description: "we deliver all places in nairobi, murang'a and kangema",
  },
  {
    id: 5,
    name: "Ungwana",
    image: "/ungwana logo.jpeg",
    description: "we deliver all places in nairobi, meru,chuka and chogoria",
  },
  {
    id: 6,
    name: "Metro Trans",
    image: "/metro trans.jpeg",
    description: "we deliver all places in nairobi,ngong-road ngong ",
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
            description={company.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Landingpage;
