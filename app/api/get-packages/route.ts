import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GetPackagesRequest {
  temp_id: string;
}

interface PackageData {
  id: number;
  mz_code: string;
  sender_name: string;
  sender_phone: string;
  sender_town: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_town: string;
  parcel_description: string;
  parcel_value: number;
  package_size: string;
  status: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // For any additional fields
}

interface GetPackagesResponse {
  response: number;
  message: string;
  packages?: PackageData[];
  data?: PackageData[];
  success?: boolean;
}

async function getPackages(temp_id: string): Promise<GetPackagesResponse> {
  const payload = {
    route: "GET-MZIGO-PACKAGES",
    temp_id
  };

  const res = await fetch(MZIGO_BASE_URL, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { temp_id } = body as GetPackagesRequest;

    if (!temp_id || typeof temp_id !== 'string') {
      return NextResponse.json(
        { 
          error: "temp_id is required and must be a string",
          success: false,
          packages: []
        },
        { status: 400 }
      );
    }

    const result = await getPackages(temp_id);

    // Handle different possible response structures
    const packages = result.packages || result.data || [];

    return NextResponse.json(
      {
        success: true,
        message: result.message || "Packages fetched successfully",
        packages: packages,
        data: result
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get packages error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch packages",
        message: "An error occurred while fetching packages",
        packages: []
      },
      { status: 500 }
    );
  }
}