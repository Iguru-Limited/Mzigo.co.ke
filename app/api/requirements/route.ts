import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseRequirements(payload: any) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.requirements)
    ? payload.requirements
    : Array.isArray(payload?.result)
    ? payload.result
    : [];
  return list.map((r: any) => ({
    id: r?.id ?? r?.code ?? r?.key ?? Math.random().toString(36).slice(2),
    label: r?.label || r?.name || r?.title || String(r ?? ""),
    value: r?.value ?? true,
  }));
}

async function fetchRequirements(company_id: number | string) {
  const res = await fetch(MZIGO_BASE_URL, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ route: "GET-COMPANY-MZIGO-REQUIREMENTS", company_id }),
    cache: "no-store",
  });
  if (!res.ok) {
    return { requirements: [], error: `HTTP ${res.status}` };
  }
  const json = await res.json();
  return { requirements: parseRequirements(json) };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("company_id") || searchParams.get("companyId") || "1";
  try {
    const data = await fetchRequirements(companyId);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ requirements: [], error: e?.message ?? "failed" }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const companyId = body?.company_id ?? body?.companyId ?? "1";
    const data = await fetchRequirements(companyId);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ requirements: [], error: e?.message ?? "failed" }, { status: 200 });
  }
}
