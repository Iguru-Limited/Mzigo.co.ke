import { NextResponse } from "next/server";

type RawPartner = Record<string, any>;
type Partner = { id: string | number; name: string; logo?: string };

const STATIC_LOGO_MAP: Record<string, string> = {
  "chania": "/Chania logo.jpeg",
  "kasese": "/kasese logo.jpeg",
  "kangema": "/Kangema.jpeg",
  "lopha travelers ltd": "/lopha-travel-ltd.jpg",
  "ungwana": "/ungwana logo.jpeg",
  "metro trans": "/metro trans.jpeg",
};

const normalizeName = (name: string) => name.trim().toLowerCase();

function parsePartners(payload: any): Partner[] {
  const list: RawPartner[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.partners)
    ? payload.partners
    : Array.isArray(payload?.result)
    ? payload.result
    : [];

  return list
    .map((it) => {
      const name =
        it?.name || it?.company || it?.title || it?.company_name || "";
      if (!name || typeof name !== "string") return null;
      const id = it?.id ?? name;
      const logo = STATIC_LOGO_MAP[normalizeName(name)];
      return { id, name, logo } as Partner;
    })
    .filter(Boolean) as Partner[];
}

export async function GET() {
  try {
    const res = await fetch("https://mzigo.ke/front_ep/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route: "ALL-PARTNERS" }),
      // Avoid caching issues since upstream is a POST endpoint
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { partners: fallbackPartners(), error: `HTTP ${res.status}` },
        { status: 200 }
      );
    }

    const json = await res.json();
    const partners = parsePartners(json);

    if (!partners.length) {
      return NextResponse.json({ partners: fallbackPartners() }, { status: 200 });
    }

    return NextResponse.json({ partners }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { partners: fallbackPartners(), error: e?.message ?? "failed" },
      { status: 200 }
    );
  }
}

function fallbackPartners(): Partner[] {
  const names = [
    "Chania",
    "Kasese",
    "Kangema",
    "Lopha travelers ltd",
    "Ungwana",
    "Metro Trans",
  ];
  return names.map((name, idx) => ({
    id: idx + 1,
    name,
    logo: STATIC_LOGO_MAP[normalizeName(name)],
  }));
}
