import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseRequirements(payload: any) {
  const root = payload?.data ?? payload ?? {};
  const company_id = root?.company_id ?? root?.companyId ?? null;
  const officesSrc = Array.isArray(root?.offices) ? root.offices : [];
  const destinationsSrc = Array.isArray(root?.destinations)
    ? root.destinations
    : [];
  const paymentsSrc = Array.isArray(root?.payment_methods)
    ? root.payment_methods
    : [];

  const offices = officesSrc.map((o: any) => ({
    id: o?.id ?? o?.code ?? o?.key ?? null,
    name: o?.name || o?.label || String(o ?? ""),
  }));
  const destinations = destinationsSrc.map((d: any) => ({
    id: d?.id ?? d?.code ?? d?.key ?? null,
    name: d?.name || d?.label || String(d ?? ""),
    route: d?.route ?? null,
  }));
  const payment_methods = paymentsSrc.map((p: any) =>
    p?.payment_method || p?.name || p?.label || String(p ?? "")
  );

  return { company_id, offices, destinations, payment_methods };
}

async function fetchRequirements(company_id: number | string) {
  const res = await fetch(MZIGO_BASE_URL, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ route: "GET-COMPANY-MZIGO-REQUIREMENTS", company_id }),
    cache: "no-store",
  });
  if (!res.ok) {
    return { company_id, offices: [], destinations: [], payment_methods: [], error: `HTTP ${res.status}` };
  }
  const json = await res.json();
  return parseRequirements(json);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("company_id") || searchParams.get("companyId") || "1";
  try {
    const data = await fetchRequirements(companyId);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ company_id: null, offices: [], destinations: [], payment_methods: [], error: e?.message ?? "failed" }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const companyId = body?.company_id ?? body?.companyId ?? "1";
    const data = await fetchRequirements(companyId);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ company_id: null, offices: [], destinations: [], payment_methods: [], error: e?.message ?? "failed" }, { status: 200 });
  }
}
