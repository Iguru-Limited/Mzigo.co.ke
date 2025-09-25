import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UpdatePackageRequest {
  package_id: number;
  sender_phone?: string;
  receiver_town?: string;
  parcel_value?: number;
  special_instructions?: string;
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

    // Validate optional fields if provided
    if (body.sender_phone && typeof body.sender_phone !== 'string') {
      return NextResponse.json(
        { error: "sender_phone must be a string" },
        { status: 400 }
      );
    }

    if (body.receiver_town && typeof body.receiver_town !== 'string') {
      return NextResponse.json(
        { error: "receiver_town must be a string" },
        { status: 400 }
      );
    }

    if (body.parcel_value !== undefined && typeof body.parcel_value !== 'number') {
      return NextResponse.json(
        { error: "parcel_value must be a number" },
        { status: 400 }
      );
    }

    if (body.special_instructions && typeof body.special_instructions !== 'string') {
      return NextResponse.json(
        { error: "special_instructions must be a string" },
        { status: 400 }
      );
    }

    // Check if at least one field to update is provided
    const updateFields = ['sender_phone', 'receiver_town', 'parcel_value', 'special_instructions'];
    const hasUpdateFields = updateFields.some(field => body[field] !== undefined);
    
    if (!hasUpdateFields) {
      return NextResponse.json(
        { error: "At least one field to update must be provided (sender_phone, receiver_town, parcel_value, special_instructions)" },
        { status: 400 }
      );
    }

    const result = await updatePackage(body);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("Update package error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update package" },
      { status: 500 }
    );
  }
}