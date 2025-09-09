import React from "react";
import CompanyCard from '../components/CompanyCard'
import logo from './lopha-travel-ltd.jpg'
import Kasese from './kasese logo.jpeg'
import Chania from './Chania logo.jpeg'
import Kangema from './Kangema.jpeg'
import Ungwana from './ungwana logo.jpeg'
import Metro from './metro trans.jpeg'







const companies = [
  {
    id: 1,
    name: "Lopha travelers ltd",
    image: logo,
    description: "we deliver all places in nairobi,ruiru, thika",
  },
  {
    id: 2,
    name: "Kasese",
    image: Kasese,
    description: "we deliver from nairobi to naivasha",
  },
  {
    id: 3,
    name: "Chania",
    image: Chania,
    description: "we deliver all places in nairobi",
  },
  {
    id: 4,
    name: "Kangema",
    image: Kangema,
    description: "we deliver all places in nairobi, murang'a and kangema",
  },
  {
    id: 5,
    name: "Ungwana",
    image: Ungwana,
    description: "we deliver all places in nairobi, meru,chuka and chogoria",
  },
  {
    id: 6,
    name: "Metro Trans",
    image: Metro,
    description: "we deliver all places in nairobi,ngong-road ngong ",
  },
];

function Landingpage() {
  return (
    <>    
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
    </>
  );
}

export default Landingpage;
