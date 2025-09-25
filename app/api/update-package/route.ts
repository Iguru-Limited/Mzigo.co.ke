import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UpdatePackageRequest {
  package_id: number;
  // Original limited fields
  sender_phone?: string;
  receiver_town?: string;
  parcel_value?: number;
  special_instructions?: string;
  // Extended editable fields (align with registration)
  sender_name?: string;
  sender_town?: string;
  receiver_name?: string;
  receiver_phone?: string;
  parcel_description?: string;
  package_size?: "small" | "medium" | "large" | string;
  payment_mode?: string;
  office_id?: number;
  company_id?: number; // optional, in case upstream needs it
}

interface UpdatePackageResponse {
  response: number;
  message: string;
  success?: boolean;
}

async function updatePackage(data: UpdatePackageRequest): Promise<UpdatePackageResponse> {
  const payload = {
    route: "UPDATE-MZIGO-PACKAGE",
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
    if (!body.package_id || typeof body.package_id !== 'number') {
      return NextResponse.json(
        { error: "package_id is required and must be a number" },
        { status: 400 }
      );
    }

    // Helper validator
    const isString = (v: any) => typeof v === 'string';
    const isNumber = (v: any) => typeof v === 'number' && !isNaN(v);

    const fieldValidators: Record<string, (v: any) => boolean> = {
      sender_phone: isString,
      receiver_town: isString,
      special_instructions: isString,
      sender_name: isString,
      sender_town: isString,
      receiver_name: isString,
      receiver_phone: isString,
      parcel_description: isString,
      package_size: isString,
      payment_mode: isString,
      parcel_value: isNumber,
      office_id: isNumber,
      company_id: isNumber,
    };

    for (const [k, validator] of Object.entries(fieldValidators)) {
      if (body[k] !== undefined && !validator(body[k])) {
        return NextResponse.json(
          { error: `${k} has invalid type` },
          { status: 400 }
        );
      }
    }

    // Check if at least one field to update is provided
    const updateFields = Object.keys(fieldValidators);
    const hasUpdateFields = updateFields.some(field => body[field] !== undefined);
    
    if (!hasUpdateFields) {
      return NextResponse.json(
        { error: "At least one field to update must be provided (sender_phone, receiver_town, parcel_value, special_instructions)" },
        { status: 400 }
      );
    }

  const result = await updatePackage(body as UpdatePackageRequest);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("Update package error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update package" },
      { status: 500 }
    );
  }
}