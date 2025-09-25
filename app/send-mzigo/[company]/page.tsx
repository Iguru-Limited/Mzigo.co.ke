"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createInitialPipelineStatus, type PipelineStatus } from "@/lib/pipelineManager";

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
  packageSize: string;
  specialInstructions: string;
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
  const [submitting, setSubmitting] = useState<boolean>(false);
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
    packageSize: "",
    specialInstructions: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (submitting) {
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      const temp_id = getCookie("device_id") || "unknown_device";
      
      // Get the office_id from the selected office
      const selectedOffice = requirements.offices.find(office => office.name === formData.senderStage);
      const office_id = selectedOffice?.id || 1;

      // Prepare the API request payload
      const requestPayload = {
        company_id: parseInt(companyId),
        office_id: office_id,
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        sender_town: formData.senderStage,
        receiver_name: formData.receiverName,
        receiver_phone: formData.receiverPhone,
        receiver_town: formData.receiverStage,
        parcel_description: formData.parcelDescription,
        parcel_value: parseInt(formData.parcelValue),
        special_instructions: formData.specialInstructions,
        package_size: formData.packageSize as "small" | "medium" | "large",
        payment_mode: formData.paymentMethod,
        temp_id: temp_id,
      };

      // Add unique request ID for debugging
      const requestId = Date.now() + Math.random();
      console.log('Submitting registration request:', requestId, requestPayload);

      // Call the register-package API
      const response = await fetch('/api/register-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register package');
      }

      const result = await response.json();
      console.log('Registration response:', requestId, result);

      // Show success message with tracking number from API response
      alert(
        `Mzigo Registered successfully!\n\n` +
          `Tracking Number: ${result.generated_code}\n` +
          `Status: ${result.message}\n` +
          `Date: ${result.s_date} ${result.s_time}\n` +
          `ID: ${result.id}`
      );

      // Save the response data to localStorage for tracking
      const storageKey = `registeredParcels_${temp_id}`;
      const existingParcels = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const parcelData = {
        ...formData,
        trackingNumber: result.generated_code,
        id: result.id,
        createdAt: `${result.s_date} ${result.s_time}`,
        pipelineStatus: createInitialPipelineStatus(),
      };
      existingParcels.push(parcelData);
      localStorage.setItem(storageKey, JSON.stringify(existingParcels));

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
        packageSize: "",
        specialInstructions: "",
        paymentMethod: requirements.payment_methods[0] ?? "",
        company: companyName,
      });

    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register package. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Build regex patterns to enforce selection from suggestions
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const makePattern = (values: string[]) =>
    values.length ? `^(?:${values.map((v) => escapeRegex(v)).join("|")})$` : undefined;

  const officePattern = useMemo(
    () => makePattern(requirements.offices.map((o) => o.name)),
    [requirements.offices]
  );
  const destinationPattern = useMemo(
    () => makePattern(requirements.destinations.map((d) => d.name)),
    [requirements.destinations]
  );
  const paymentPattern = useMemo(
    () => makePattern(requirements.payment_methods),
    [requirements.payment_methods]
  );

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
              pattern={officePattern}
              title="Please select a value from the suggestions"
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
              pattern={destinationPattern}
              title="Please select a value from the suggestions"
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

            <select
              name="packageSize"
              value={formData.packageSize}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            >
              <option value="">Select Package Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <textarea
              name="specialInstructions"
              placeholder="Special Instructions (optional)"
              value={formData.specialInstructions}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2 text-black"
              rows={3}
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
              pattern={paymentPattern}
              title="Please select a value from the suggestions"
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
          disabled={submitting || loadingReq}
          className="w-full bg-[#2c3e50] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Registering..." : "Register Mzigo"}
        </button>
      </form>
    </div>
  );
}

export default SendMzigoPage;
