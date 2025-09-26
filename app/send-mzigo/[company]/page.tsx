"use client";

import React, { useEffect, useState } from "react";
import LocationSelector from "@/components/LocationSelector";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { createInitialPipelineStatus, type PipelineStatus } from "@/lib/pipelineManager";
import { useToast } from "@/components/ToastProvider";

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
  const companyName = company
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("company_id") || "1";
  const isEdit = searchParams.get("edit") === "1";
  const editingPackageId = searchParams.get("package_id");
  const toast = useToast();

  const [requirements, setRequirements] = useState<{
    offices: Office[];
    destinations: Destination[];
    payment_methods: string[];
  }>({ offices: [], destinations: [], payment_methods: [] });
  const [loadingReq, setLoadingReq] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
    paymentMethod: "",
    company: companyName,
  });
  const [originalData, setOriginalData] = useState<typeof formData | null>(null);
  const [missingEditSource, setMissingEditSource] = useState(false);

  // Utilities
  const toTitle = (s: string) =>
    (s || "")
      .toLowerCase()
      .replace(/\b([a-z])/g, (m, p1) => p1.toUpperCase());

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
          // Only set payment method default; keep sender & receiver empty so user must choose.
          setFormData((prev) => ({
            ...prev,
            paymentMethod: prev.paymentMethod || payment_methods[0] || "",
          }));
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

  // Load existing package data for edit mode from sessionStorage
  useEffect(() => {
    if (!isEdit || !editingPackageId) return;
    const key = `editingPackage_${editingPackageId}`;
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) {
        setMissingEditSource(true);
        setTimeout(() => router.push('/profile'), 2500);
        return;
      }
      const pkg = JSON.parse(stored);
      const mapped = {
        senderName: pkg.sender_name || "",
        senderPhone: pkg.sender_phone || "",
        senderStage: toTitle(pkg.sender_town || ""),
        receiverName: pkg.receiver_name || "",
        receiverPhone: pkg.receiver_phone || "",
        receiverStage: toTitle(pkg.receiver_town || ""),
        parcelDescription: pkg.parcel_description || "",
        parcelValue: String(pkg.parcel_value ?? ""),
        packageSize: pkg.package_size || "",
        specialInstructions: pkg.special_instructions || "",
        paymentMethod: pkg.payment_mode || "",
        company: companyName,
      };
      setFormData(mapped);
      setOriginalData(mapped);
    } catch (e) {
      console.error("Failed to load editing package", e);
      setMissingEditSource(true);
      setTimeout(() => router.push('/profile'), 2500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingPackageId]);

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
      const selectedOffice = requirements.offices.find(
        office => office.name?.toLowerCase() === formData.senderStage.toLowerCase()
      );
      const office_id = selectedOffice?.id || 1;

      let apiUrl = '/api/register-package';
      let methodDescription = 'register';
      let requestPayload: any;

      if (isEdit && originalData) {
        const diff: any = { package_id: Number(editingPackageId) };
        const map: Array<[keyof typeof formData, string, string]> = [
          ['senderName','sender_name',''],
          ['senderPhone','sender_phone',''],
          ['senderStage','sender_town',''],
          ['receiverName','receiver_name',''],
          ['receiverPhone','receiver_phone',''],
          ['receiverStage','receiver_town',''],
          ['parcelDescription','parcel_description',''],
          ['parcelValue','parcel_value','number'],
          ['packageSize','package_size',''],
          ['specialInstructions','special_instructions',''],
          ['paymentMethod','payment_mode',''],
        ];
        map.forEach(([localKey, apiKey, type]) => {
          const newVal = (formData as any)[localKey];
          const oldVal = (originalData as any)[localKey];
            if (newVal !== oldVal) {
            diff[apiKey] = type === 'number' ? parseInt(newVal || '0') : newVal;
          }
        });
        if (formData.senderStage !== originalData.senderStage) {
          diff.office_id = office_id;
          diff.company_id = parseInt(companyId);
        }
        if (Object.keys(diff).length === 1) {
          toast.info('No changes to update.');
          setSubmitting(false);
          return;
        }
        apiUrl = '/api/update-package';
        methodDescription = 'update';
        requestPayload = diff;
      } else {
        // Prepare the API request payload for new registration
        requestPayload = {
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
      }

      // Add unique request ID for debugging
      const requestId = Date.now() + Math.random();
      console.log('Submitting registration request:', requestId, requestPayload);

      // Call the register-package API
      const response = await fetch(apiUrl, {
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
  console.log(methodDescription + ' response:', requestId, result);

      // Show success message with tracking number from API response
      if (isEdit) {
        try { sessionStorage.removeItem(`editingPackage_${editingPackageId}`); } catch {}
        toast.success('Package updated successfully');
        router.push('/profile');
        return;
      } else {
        toast.success(
          `Mzigo registered successfully. Tracking: ${result.generated_code} — ${result.message} (${result.s_date} ${result.s_time})`
        );
      }

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
      if (!isEdit) {
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
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register package. Please try again.");
      toast.error(error.message || "Failed to register package. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Patterns removed – custom autocomplete enforces selection; payment now a select.

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-4 text-black">
        {isEdit ? `Edit Mzigo (${companyName})` : `Send with ${companyName}`}
      </h1>
      {isEdit && (
        <div className={`mb-6 px-4 py-3 rounded border text-sm ${missingEditSource ? 'border-red-300 bg-red-50 text-red-700' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
          {missingEditSource ? (
            <span>Original package data not found. Redirecting back to profile…</span>
          ) : (
            <span>Editing Mzigo.</span>
          )}
        </div>
      )}

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

            <div className="md:col-span-2 relative">
              <LocationSelector
                label=""
                placeholder="From"
                value={formData.senderStage}
                onChange={(val) => setFormData((p) => ({ ...p, senderStage: val }))}
                options={requirements.offices.map((o) => toTitle(o.name))}
                disabled={loadingReq}
                required
                panel
              />
            </div>
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

            <div className="md:col-span-2 relative">
              <LocationSelector
                placeholder="To"
                value={formData.receiverStage}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, receiverStage: val }))
                }
                options={requirements.destinations.map((d) => toTitle(d.name))}
                disabled={loadingReq}
                required
                panel
              />
            </div>
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
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={loadingReq}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            >
              <option value="">Select Payment Method</option>
              {requirements.payment_methods.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || loadingReq}
          className="w-full bg-green-400 text-white py-3 px-6 rounded-md hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? (isEdit ? "Updating..." : "Registering...") : (isEdit ? "Edit Mzigo" : "Register Mzigo")}
        </button>
      </form>
    </div>
  );
}

export default SendMzigoPage;
