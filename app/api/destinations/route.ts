import { NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDestinations(payload: any) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.destinations)
    ? payload.destinations
    : Array.isArray(payload?.result)
    ? payload.result
    : [];
  return list.map((d: any, idx: number) => {
    const id = d?.id ?? idx + 1;
    const name = d?.name || d?.destination || d?.title || String(d ?? "");
    return { id, name };
  });
}

export async function GET() {
  try {
    const res = await fetch(MZIGO_BASE_URL, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ route: "MZIGO-DESTINATIONS" }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { destinations: [], error: `HTTP ${res.status}` },
        { status: 200 }
      );
    }

    const json = await res.json();
    const destinations = parseDestinations(json);
    return NextResponse.json({ destinations }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { destinations: [], error: e?.message ?? "failed" },
      { status: 200 }
    );
  }
}
