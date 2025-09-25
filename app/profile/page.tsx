"use client";

import React, { useEffect, useState } from "react";
import CompanyCard from "@/components/CompanyCard";

interface Parcel {
  senderName: string;
  senderPhone: string;
  senderStage: string;
  receiverName: string;
  receiverPhone: string;
  receiverStage: string;
  parcelDescription: string;
  parcelValue: string;
  paymentMethod: string;
  trackingNumber?: string;
  company: string;
}

const companies = [
  {
    id: 1,
    name: "Lopha Travelers Ltd",
    image: "/lopha-travel-ltd.jpg",
    stages: ["Nairobi", "Ruiru", "Thika"],
    description: "Reliable transport services across key routes.",
  },
  {
    id: 2,
    name: "Kasese",
    image: "/kasese logo.jpeg",
    stages: ["Nairobi", "Naivasha"],
    description: "Efficient delivery in the Kasese region.",
  },
  {
    id: 3,
    name: "Chania",
    image: "/Chania logo.jpeg",
    stages: ["Nairobi", "Emali", "Mombasa"],
    description: "Fast and secure parcel delivery to coastal areas.",
  },
  {
    id: 4,
    name: "Kangema",
    image: "/Kangema.jpeg",
    stages: ["Nairobi", "Kangema", "Murang'a"],
    description: "Trusted transport for Murang'a and surrounding areas.",
  },
  {
    id: 5,
    name: "Ungwana",
    image: "/ungwana logo.jpeg",
    stages: ["Nairobi", "Embu", "Meru"],
    description: "Comprehensive logistics for Embu and Meru routes.",
  },
  {
    id: 6,
    name: "Metro Trans",
    image: "/metro trans.jpeg",
    stages: ["Nairobi", "Junction-mall", "Ngong-road", "Ngong"],
    description: "Urban and suburban transport solutions.",
  },
];

const ProfilePage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [usedCompanies, setUsedCompanies] = useState<typeof companies>([]);

  // Utility to get cookie by name
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  useEffect(() => {
    const deviceId = getCookie("device_id") || "unknown_device";
    const storageKey = `registeredParcels_${deviceId}`;
    const storedParcels = localStorage.getItem(storageKey);
    if (storedParcels) {
      try {
        const parsedParcels = JSON.parse(storedParcels);
        setParcels(parsedParcels);
        // Get unique companies used
        const companyNames = [...new Set(parsedParcels.map((p: Parcel) => p.company))];
        const used = companies.filter(c => companyNames.includes(c.name));
        setUsedCompanies(used);
      } catch (error) {
        console.error("Error parsing parcels from localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      
      {usedCompanies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recently Used Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usedCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                companyName={company.name}
                imageSrc={company.image}
                description={company.description}
              />
            ))}
          </div>
        </div>
      )}
       <h1 className="text-3xl font-bold text-center mb-8">
        Your Registered Parcels
      </h1>
      {parcels.length === 0 ? (
        <p className="text-center">No parcels registered yet.</p>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sent Mzigo with {parcel.company}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Sender Details</h3>
                  <p>Name: {parcel.senderName}</p>
                  <p>Phone: {parcel.senderPhone}</p>
                  <p>Stage: {parcel.senderStage}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Receiver Details</h3>
                  <p>Name: {parcel.receiverName}</p>
                  <p>Phone: {parcel.receiverPhone}</p>
                  <p>Stage: {parcel.receiverStage}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Parcel Details</h3>
                  <p>Description: {parcel.parcelDescription}</p>
                  <p>Value: {parcel.parcelValue} KES</p>
                </div>
                <div>
                  <h3 className="font-semibold">Payment Details</h3>
                  <p>Method: {parcel.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Tracking Number</h3>
                  <p>{parcel.trackingNumber || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
