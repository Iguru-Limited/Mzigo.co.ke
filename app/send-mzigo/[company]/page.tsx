"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createInitialPipelineStatus, type PipelineStatus } from "../../utils/pipelineManager";

// Page-level dynamic params are accessed via useParams in client components

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

type Office = { id: number | string; name: string };
type Destination = { id: number | string; name: string; route?: number | null };

function SendMzigoPage() {
  const routeParams = useParams<{ company: string | string[] }>();
  const companyParam = Array.isArray(routeParams?.company)
    ? routeParams.company[0]
    : routeParams?.company || "";
  const company = companyParam;
  const companyName = useMemo(
    () => company.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    [company]
  );
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company_id") || "1";

  const [requirements, setRequirements] = useState<{
    offices: Office[];
    destinations: Destination[];
    payment_methods: string[];
  }>({ offices: [], destinations: [], payment_methods: [] });
  const [loadingReq, setLoadingReq] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    paymentMethod: "",
    company: companyName,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  useEffect(() => {
    let abort = false;
    const load = async () => {
      try {
        setLoadingReq(true);
        setError(null);
        const res = await fetch(
          `/api/requirements?company_id=${encodeURIComponent(companyId)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const offices: Office[] = Array.isArray(json?.offices) ? json.offices : [];
        const destinations: Destination[] = Array.isArray(json?.destinations)
          ? json.destinations
          : [];
        const payment_methods: string[] = Array.isArray(json?.payment_methods)
          ? json.payment_methods
          : [];
        if (!abort) {
          setRequirements({ offices, destinations, payment_methods });
          // Set default payment method if empty
          if (!formData.paymentMethod && payment_methods.length > 0) {
            setFormData((prev) => ({ ...prev, paymentMethod: payment_methods[0] }));
          }
        }
      } catch (e: any) {
        if (!abort) {
          setRequirements({ offices: [], destinations: [], payment_methods: [] });
          setError(e?.message ?? "Failed to load requirements");
        }
      } finally {
        if (!abort) setLoadingReq(false);
      }
    };
    load();
    return () => {
      abort = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

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
      createdAt,
    };

    // Save parcel data to localStorage keyed by deviceId
    const storageKey = `registeredParcels_${deviceId}`;
    const existingParcels = JSON.parse(localStorage.getItem(storageKey) || "[]");
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
      paymentMethod: requirements.payment_methods[0] ?? "",
      company: companyName,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        Send with {companyName}
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sender Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Sender Details</h2>
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
              type="text"
              name="senderStage"
              list="senderStageOptions"
              placeholder="Sender Office/Stage"
              value={formData.senderStage}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              required
              disabled={loadingReq}
            />
            <datalist id="senderStageOptions">
              {requirements.offices.map((o) => (
                <option key={o.id} value={o.name} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Receiver Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Receiver Details</h2>
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
              type="text"
              name="receiverStage"
              list="receiverStageOptions"
              placeholder="Receiver Destination/Stage"
              value={formData.receiverStage}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              required
              disabled={loadingReq}
            />
            <datalist id="receiverStageOptions">
              {requirements.destinations.map((d) => (
                <option key={d.id} value={d.name} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Parcel Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">Parcel Details</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-black">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="paymentMethod"
              list="paymentMethodOptions"
              placeholder="Payment Method"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
              disabled={loadingReq}
            />
            <datalist id="paymentMethodOptions">
              {requirements.payment_methods.map((m, idx) => (
                <option key={idx} value={m} />
              ))}
            </datalist>
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
