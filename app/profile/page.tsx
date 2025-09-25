"use client";

import React, { useEffect, useState } from "react";
import CompanyCard from "@/components/CompanyCard";

interface Package {
  id: number;
  company: number;
  office: number;
  sender_name: string;
  sender_phone: string;
  sender_town: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_town: string;
  parcel_description: string;
  parcel_value: number;
  package_size: string;
  payment_mode: string;
  generated_code: string;
  s_date: string;
  s_time: string;
  is_suspicious: number;
  suspect_score: string | null;
  suspect_of_id: number | null;
  [key: string]: any;
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
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility to get cookie by name
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  // Function to get company name by ID
  const getCompanyName = (companyId: number | string): string => {
    const company = companies.find(c => c.id === Number(companyId));
    return company ? company.name : 'Unknown Company';
  };

  // Function to fetch packages from API
  const fetchPackages = async (tempId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/get-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp_id: tempId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.packages || []);
      } else {
        setError(data.error || 'Failed to fetch packages');
        setPackages([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Network error occurred while fetching packages');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a package
  const handleDeletePackage = async (packageId: number) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/delete-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: packageId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted package from the state
        setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
        alert('Package deleted successfully');
      } else {
        alert(`Failed to delete package: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting package');
    }
  };

  useEffect(() => {
    const deviceId = getCookie("device_id") || "unknown_device";
    // Use device_id as temp_id to fetch packages
    fetchPackages(deviceId);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">          
       <h1 className="text-3xl font-bold text-center mb-8">
        Your Registered Packages
      </h1>
      
      {loading && (
        <div className="text-center">
          <p>Loading your packages...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => {
              const deviceId = getCookie("device_id") || "unknown_device";
              fetchPackages(deviceId);
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && packages.length === 0 && (
        <p className="text-center">No packages registered yet.</p>
      )}
      
      {!loading && !error && packages.length > 0 && (
        <div className="space-y-4">
          {packages.map((pkg: Package, index: number) => (
            <div key={pkg.id || index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  Sent Mzigo with {getCompanyName(pkg.company) || 'Unknown Company'}
                </h2>
                <div className="flex gap-2">
                  {pkg.is_suspicious === 1 && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Suspicious
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Registered
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Sender Details</h3>
                  <p>Name: {pkg.sender_name}</p>
                  <p>Phone: {pkg.sender_phone || 'N/A'}</p>
                  <p>Stage: {pkg.sender_town}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Receiver Details</h3>
                  <p>Name: {pkg.receiver_name}</p>
                  <p>Phone: {pkg.receiver_phone || 'N/A'}</p>
                  <p>Stage: {pkg.receiver_town}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Parcel Details</h3>
                  <p>Description: {pkg.parcel_description}</p>
                  <p>Value: {pkg.parcel_value} KES</p>
                  <p>Size: {pkg.package_size}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Payment Details</h3>
                  <p>Method: {pkg.payment_mode}</p>
                  <p>Date: {pkg.s_date}</p>
                  <p>Time: {pkg.s_time}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="mb-2">
                  <h3 className="font-semibold">Tracking Number</h3>
                  <p className="text-lg font-mono">{pkg.generated_code}</p>
                </div>
                {pkg.is_suspicious === 1 && pkg.suspect_score && (
                  <div className="mb-2 p-2 bg-red-50 rounded">
                    <p className="text-sm text-red-700">
                      <strong>Fraud Alert:</strong> Suspect Score: {pkg.suspect_score}
                      {pkg.suspect_of_id && ` | Related to Package ID: ${pkg.suspect_of_id}`}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Delete button */}
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
