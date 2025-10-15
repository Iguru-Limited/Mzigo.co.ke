"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast, ConfirmDialog } from "@/components/ui/shared";
import type { Package as APIPackage } from "@/types/profile";


const ProfilePage: React.FC = () => {
  const [packages, setPackages] = useState<APIPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Legacy inline edit state removed; redirects to register page for editing.
  const [destinations, setDestinations] = useState<{id: number | string; name: string}[]>([]);
  const [partnersMap, setPartnersMap] = useState<Record<string | number, string>>({});
  const [loadingPartners, setLoadingPartners] = useState(false);

  // Utility to get cookie by name
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  // Function to get company name by ID (dynamic only)
  const getCompanyName = (companyId: number | string): string => {
    if (!companyId && companyId !== 0) return 'Unknown Company';
    return partnersMap[companyId] || 'Unknown Company';
  };

  // Fetch partners (companies) once to build an id->name map
  const fetchPartners = async () => {
    try {
      setLoadingPartners(true);
      const res = await fetch('/api/partners', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load partners');
      const json = await res.json();
      const list: Array<{ id: number | string; name: string }> = Array.isArray(json?.partners) ? json.partners : [];
      if (list.length) {
        const map: Record<string | number, string> = {};
        list.forEach(p => { if (p.id != null && p.name) map[p.id] = p.name; });
        setPartnersMap(map);
      }
    } catch (e) {
  console.warn('Partners fetch failed:', (e as any)?.message);
    } finally {
      setLoadingPartners(false);
    }
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

  // Function to delete a package (opens confirm dialog)
  const handleDeletePackage = (packageId: number) => {
    setDeletingId(packageId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId == null) return;
    setDeleting(true);
    try {
      const response = await fetch('/api/delete-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: deletingId })
      });
      const data = await response.json();
      if (data.success) {
        setPackages(prev => prev.filter(pkg => pkg.id !== deletingId));
        toast.success('Package deleted successfully');
        setConfirmOpen(false);
        setDeletingId(null);
      } else {
        toast.error(`Failed to delete package: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error occurred while deleting package');
    } finally {
      setDeleting(false);
    }
  };

  // Function to fetch destinations for a company
  const fetchDestinations = async (_companyId: number) => {
    /* no-op for redirect edit flow */
  };

  // Function to handle edit package
  const router = useRouter();
  const slugify = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleEditPackage = (pkg: APIPackage) => {
    // Persist full package in sessionStorage so register page can pre-fill
    try {
      sessionStorage.setItem(
        `editingPackage_${pkg.id}`,
        JSON.stringify(pkg)
      );
    } catch (e) {
      console.warn("Failed to store editing package", e);
    }
    const companyName = getCompanyName(pkg.company);
    const slug = slugify(companyName || "company");
    router.push(`/send-mzigo/${slug}?company_id=${pkg.company}&edit=1&package_id=${pkg.id}`);
  };

  // Function to cancel edit
  const handleCancelEdit = () => {};

  // Function to update package
  const handleUpdatePackage = async () => {};

  useEffect(() => {
    const deviceId = getCookie("device_id") || "unknown_device";
    // Use device_id as temp_id to fetch packages
    fetchPackages(deviceId);
    fetchPartners();
  }, []);

  // (Editing now handled via redirect; no local edit form state.)

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
          {packages.map((pkg: APIPackage, index: number) => (
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
                  <h3 className="font-semibold">Mzigo Number</h3>
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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete package?"
        description="This action cannot be undone. The package will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => { if (!deleting) setConfirmOpen(false); }}
        onConfirm={confirmDelete}
      />

      {/* Modal removed; edit now redirects to register form */}
    </div>
  );
};

export default ProfilePage;
