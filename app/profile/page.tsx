"use client";

import React, { useEffect, useState } from "react";

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
}

const ProfilePage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);

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
      } catch (error) {
        console.error("Error parsing parcels from localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your Registered Parcels
      </h1>
      {parcels.length === 0 ? (
        <p className="text-center">No parcels registered yet.</p>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Parcel {index + 1}</h2>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
