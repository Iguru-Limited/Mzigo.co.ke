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
  special_instructions?: string;
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
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [editForm, setEditForm] = useState({
    sender_phone: '',
    receiver_town: '',
    parcel_value: 0,
    special_instructions: ''
  });
  const [destinations, setDestinations] = useState<{id: number | string; name: string}[]>([]);

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

  // Function to fetch destinations for a company
  const fetchDestinations = async (companyId: number) => {
    try {
      const response = await fetch(`/api/requirements?company_id=${companyId}`, {
        cache: "no-store"
      });
      
      if (response.ok) {
        const data = await response.json();
        const destinations = Array.isArray(data?.destinations) ? data.destinations : [];
        setDestinations(destinations);
      } else {
        console.error('Failed to fetch destinations');
        setDestinations([]);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    }
  };

  // Function to handle edit package
  const handleEditPackage = (pkg: Package) => {
    console.log('Editing package:', pkg); // Debug log
    setEditingPackage(pkg);
    setEditForm({
      sender_phone: pkg.sender_phone || '',
      receiver_town: pkg.receiver_town || '',
      parcel_value: Number(pkg.parcel_value) || 0,
      special_instructions: pkg.special_instructions || ''
    });
    
    // Fetch destinations for this company
    if (pkg.company) {
      fetchDestinations(pkg.company);
    }
  };

  // Function to cancel edit
  const handleCancelEdit = () => {
    setEditingPackage(null);
    setEditForm({
      sender_phone: '',
      receiver_town: '',
      parcel_value: 0,
      special_instructions: ''
    });
  };

  // Function to update package
  const handleUpdatePackage = async () => {
    if (!editingPackage) return;

    try {
      const response = await fetch('/api/update-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: editingPackage.id,
          sender_phone: editForm.sender_phone,
          receiver_town: editForm.receiver_town,
          parcel_value: editForm.parcel_value,
          special_instructions: editForm.special_instructions
        })
      });
      
      const data = await response.json();
      
      if (data.response === 1 || data.success) {
        // Update the package in the state
        setPackages(prev => prev.map(pkg => 
          pkg.id === editingPackage.id 
            ? { 
                ...pkg, 
                sender_phone: editForm.sender_phone,
                receiver_town: editForm.receiver_town,
                parcel_value: editForm.parcel_value,
                special_instructions: editForm.special_instructions
              }
            : pkg
        ));
        alert('Package updated successfully');
        handleCancelEdit();
      } else {
        alert(`Failed to update package: ${data.error || data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Network error occurred while updating package');
    }
  };

  useEffect(() => {
    const deviceId = getCookie("device_id") || "unknown_device";
    // Use device_id as temp_id to fetch packages
    fetchPackages(deviceId);
  }, []);

  // Update form when editing package changes
  useEffect(() => {
    if (editingPackage) {
      setEditForm({
        sender_phone: editingPackage.sender_phone || '',
        receiver_town: editingPackage.receiver_town || '',
        parcel_value: Number(editingPackage.parcel_value) || 0,
        special_instructions: editingPackage.special_instructions || ''
      });
    }
  }, [editingPackage]);

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
                  {pkg.special_instructions && (
                    <p>Special Instructions: {pkg.special_instructions}</p>
                  )}
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
              
              {/* Edit and Delete buttons */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Package
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-400">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Package #{editingPackage.id}</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.sender_phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sender_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sender phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver Town/Destination
                  </label>
                  <input
                    type="text"
                    list="receiverTownOptions"
                    value={editForm.receiver_town}
                    onChange={(e) => setEditForm(prev => ({ ...prev, receiver_town: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter or select receiver town/destination"
                  />
                  <datalist id="receiverTownOptions">
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.name} />
                    ))}
                  </datalist>
                  {destinations.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Start typing to see available destinations for this company
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parcel Value (KES)
                  </label>
                  <input
                    type="number"
                    value={editForm.parcel_value}
                    onChange={(e) => setEditForm(prev => ({ ...prev, parcel_value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter parcel value"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={editForm.special_instructions}
                    onChange={(e) => setEditForm(prev => ({ ...prev, special_instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter special instructions"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdatePackage}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Update Package
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
