import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DeletePackageRequest {
  package_id: number;
}

interface DeletePackageResponse {
  response: number;
  message: string;
  success?: boolean;
}

async function deletePackage(package_id: number): Promise<DeletePackageResponse> {
  const payload = {
    route: "HARD-DELETE-MZIGO-PACKAGE",
    package_id
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { package_id } = body as DeletePackageRequest;

    if (!package_id || typeof package_id !== 'number') {
      return NextResponse.json(
        { 
          error: "package_id is required and must be a number",
          success: false 
        },
        { status: 400 }
      );
    }

    const result = await deletePackage(package_id);

    return NextResponse.json(
      {
        success: true,
        message: result.message || "Package deleted successfully",
        data: result
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Delete package error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete package",
        message: "An error occurred while deleting the package"
      },
      { status: 500 }
    );
  }
}

// Also support POST method for flexibility
export async function POST(request: NextRequest) {
  return DELETE(request);
}