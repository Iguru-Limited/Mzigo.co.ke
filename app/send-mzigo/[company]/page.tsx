"use client";

import React, { useState } from "react";

interface PageProps {
  params: {
    company: string;
  };
}

function SendMzigoPage({ params }: PageProps) {
  const { company } = params;
  const companyName = company
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize words

  const [formData, setFormData] = useState({
    // Sender Details
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    senderAddress: "",
    // Receiver Details
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverAddress: "",
    // Parcel Details
    parcelDescription: "",
    parcelWeight: "",
    parcelLength: "",
    parcelWidth: "",
    parcelHeight: "",
    parcelValue: "",
    // Payment Details
    paymentMethod: "cash",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
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
            <input
              type="email"
              name="senderEmail"
              placeholder="Email"
              value={formData.senderEmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
            <textarea
              name="senderAddress"
              placeholder="Address"
              value={formData.senderAddress}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              rows={3}
              required
            />
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
            <input
              type="email"
              name="receiverEmail"
              placeholder="Email"
              value={formData.receiverEmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
            <textarea
              name="receiverAddress"
              placeholder="Address"
              value={formData.receiverAddress}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              rows={3}
              required
            />
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
              name="parcelWeight"
              placeholder="Weight (kg)"
              value={formData.parcelWeight}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              step="0.1"
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
            <input
              type="number"
              name="parcelLength"
              placeholder="Length (cm)"
              value={formData.parcelLength}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
            <input
              type="number"
              name="parcelWidth"
              placeholder="Width (cm)"
              value={formData.parcelWidth}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
            <input
              type="number"
              name="parcelHeight"
              placeholder="Height (cm)"
              value={formData.parcelHeight}
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
              <option value="card">Credit/Debit Card</option>
              <option value="mpesa">M-Pesa</option>
            </select>
            {formData.paymentMethod === "card" && (
              <>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
                  required
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="Expiry Date (MM/YY)"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  required
                />
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2c3e50] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}

export default SendMzigoPage;
