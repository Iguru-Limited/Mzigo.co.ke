import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RegisterPackageRequest {
  company_id: number;
  office_id: number;
  sender_name: string;
  sender_phone: string;
  sender_town: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_town: string;
  parcel_description: string;
  parcel_value: number;
  special_instructions: string;
  package_size: "small" | "medium" | "large";
  payment_mode: string;
  temp_id: string;
}

interface RegisterPackageResponse {
  response: number;
  message: string;
  id: number;
  mz_code: string;
  is_suspicious: boolean;
  suspect_score: number | null;
  suspect_of_id: number | null;
  s_date: string;
  s_time: string;
  suspicious_matches: any[];
}

async function registerPackage(data: RegisterPackageRequest): Promise<RegisterPackageResponse> {
  const payload = {
    route: "REGISTER-PACKAGE",
    ...data
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

  const json = await res.json();
  return json;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'company_id', 'office_id', 'sender_name', 'sender_phone', 'sender_town',
      'receiver_name', 'receiver_phone', 'receiver_town', 'parcel_description',
      'parcel_value', 'package_size', 'payment_mode', 'temp_id'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate package_size
    if (!['small', 'medium', 'large'].includes(body.package_size)) {
      return NextResponse.json(
        { error: 'Invalid package_size. Must be small, medium, or large' },
        { status: 400 }
      );
    }

    const result = await registerPackage(body);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("Register package error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register package" },
      { status: 500 }
    );
  }
}