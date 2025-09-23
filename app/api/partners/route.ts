import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";

type RawPartner = Record<string, any>;
type Partner = { id: string | number; name: string; logo?: string };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const logosDir = path.join(process.cwd(), "public", "partners");

function readLogoFiles(): string[] {
  try {
    return fs
      .readdirSync(logosDir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => /\.(png|jpe?g|webp|gif|svg)$/i.test(name));
  } catch {
    return [];
  }
}

const normalizeKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "") // drop extension
    .replace(/[^a-z0-9]+/g, "") // strip non-alphanumerics
    .trim();

function findLogoForName(name: string): string | undefined {
  const files = readLogoFiles();
  if (!files.length) return undefined;
  const key = normalizeKey(name);
  if (!key) return undefined;
  const match = files.find((f) => normalizeKey(f).includes(key));
  return match ? "/partners/" + match : undefined;
}

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
      const logo = findLogoForName(name);
      return { id, name, logo } as Partner;
    })
    .filter(Boolean) as Partner[];
}

export async function GET() {
  try {
    console.time("api:partners");
    const logoFiles = readLogoFiles();
    console.log(`[api/partners] Starting fetch. Local logos: ${logoFiles.length}`);
    const res = await fetch(MZIGO_BASE_URL, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ route: "ALL-PARTNERS" }),
      // Avoid caching issues since upstream is a POST endpoint
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[api/partners] Upstream error: HTTP ${res.status}`);
      return NextResponse.json(
        { partners: fallbackPartners(), error: `HTTP ${res.status}` },
        { status: 200 }
      );
    }

    const json = await res.json();
    const partners = parsePartners(json);
    const withLogo = partners.filter((p) => !!p.logo).length;
    console.log(
      `[api/partners] Partners parsed: ${partners.length}. With logo: ${withLogo}. Without logo: ${partners.length - withLogo}`
    );
    if (!partners.length) {
      console.log("[api/partners] Empty partner list, using fallback");
      return NextResponse.json({ partners: fallbackPartners() }, { status: 200 });
    }
    const resp = NextResponse.json({ partners }, { status: 200 });
    console.timeEnd("api:partners");
    return resp;
  } catch (e: any) {
    console.error("[api/partners] Failed:", e?.message ?? e);
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
    logo: findLogoForName(name),
  }));
}
