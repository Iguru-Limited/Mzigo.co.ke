"use client";

import React, { useState } from "react";
import { createInitialPipelineStatus, PipelineStatus } from "../../utils/pipelineManager";

interface PageProps {
  params: {
    company: string;
  };
}

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
  trackingNumber: string;
  company: string;
  pipelineStatus: PipelineStatus;
  createdAt: string;
}

const companies = [
  {
    id: 1,
    name: "Lopha travelers ltd",
    image: "/lopha-travel-ltd.jpg",
    stages: ["Nairobi", "Ruiru", "Thika"],
  },
  {
    id: 2,
    name: "Kasese",
    image: "/kasese logo.jpeg",
    stages: ["Nairobi", "Naivasha"],
  },
  {
    id: 3,
    name: "Chania",
    image: "/Chania logo.jpeg",
    stages: ["Nairobi", "Emali", "Mombasa"],
  },
  {
    id: 4,
    name: "Kangema",
    image: "/Kangema.jpeg",
    stages: ["Nairobi", "Kangema", "Murang'a"],
  },
  {
    id: 5,
    name: "Ungwana",
    image: "/ungwana logo.jpeg",
    stages: ["Nairobi", "Embu", "Meru"],
  },
  {
    id: 6,
    name: "Metro Trans",
    image: "/metro trans.jpeg",
    stages: ["Nairobi", "Junction-mall", "Ngong-road", "Ngong"],
  },
];

function SendMzigoPage({ params }: PageProps) {
  const { company } = params;
  const companyName = company
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize words

  const currentCompany = companies.find(
    (c) => c.name.toLowerCase() === companyName.toLowerCase()
  );

  const [formData, setFormData] = useState({
    // Sender Details
    senderName: "",
    senderPhone: "",
    senderStage: "",
    // Receiver Details
    receiverName: "",
    receiverPhone: "",
    receiverStage: "",
    // Parcel Details
    parcelDescription: "",
    parcelValue: "",
    // Payment Details
    paymentMethod: "cash",
    company: companyName,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Utility to get cookie by name
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  // Function to generate a random tracking number
  const generateTrackingNumber = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let trackingNumber = "";
    for (let i = 0; i < 10; i++) {
      trackingNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return trackingNumber;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deviceId = getCookie("device_id") || "unknown_device";

    // Generate tracking number and create initial pipeline status
    const trackingNumber = generateTrackingNumber();
    const pipelineStatus = createInitialPipelineStatus();
    const createdAt = new Date().toISOString();

    // Create complete parcel object with pipeline status
    const parcelData: Parcel = {
      ...formData,
      trackingNumber,
      pipelineStatus,
      createdAt
    };

    // Save parcel data to localStorage keyed by deviceId
    const storageKey = `registeredParcels_${deviceId}`;
    const existingParcels = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    existingParcels.push(parcelData);
    localStorage.setItem(storageKey, JSON.stringify(existingParcels));

    console.log("Form submitted:", parcelData);
    
    // Show success message with tracking number and initial status
    alert(
      `Mzigo Registered successfully!\n\n` +
      `Tracking Number: ${trackingNumber}\n` +
      `Initial Status: ${pipelineStatus.registered.label}\n` +
      `Created: ${new Date(createdAt).toLocaleString()}`
    );

    // Reset form
    setFormData({
      senderName: "",
      senderPhone: "",
      senderStage: "",
      receiverName: "",
      receiverPhone: "",
      receiverStage: "",
      parcelDescription: "",
      parcelValue: "",
      paymentMethod: "cash",
      company: companyName,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Send with {companyName}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sender Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Sender Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="senderName"
              placeholder="Full Name"
              value={formData.senderName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
            <input
              type="tel"
              name="senderPhone"
              placeholder="Phone Number"
              value={formData.senderPhone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />

            <select
              name="senderStage"
              value={formData.senderStage}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              required
            >
              <option value="">Select Sender Stage</option>
              {currentCompany?.stages.map((stage, idx) => (
                <option key={idx} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiver Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Receiver Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="receiverName"
              placeholder="Full Name"
              value={formData.receiverName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
            <input
              type="tel"
              name="receiverPhone"
              placeholder="Phone Number"
              value={formData.receiverPhone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />

            <select
              name="receiverStage"
              value={formData.receiverStage}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              required
            >
              <option value="">Select Receiver Stage</option>
              {currentCompany?.stages.map((stage, idx) => (
                <option key={idx} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parcel Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Parcel Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              name="parcelDescription"
              placeholder="Description"
              value={formData.parcelDescription}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              rows={3}
              required
            />

            <input
              type="number"
              name="parcelValue"
              placeholder="Value (KES)"
              value={formData.parcelValue}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Payment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            >
              <option value="cash">Cash on Delivery</option>
              <option value="mpesa">M-Pesa</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2c3e50] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition"
        >
          Register Mzigo
        </button>
      </form>
    </div>
  );
}

export default SendMzigoPage;
