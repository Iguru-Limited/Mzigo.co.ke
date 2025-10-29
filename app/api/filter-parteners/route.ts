import { NextRequest, NextResponse } from "next/server";
import { MZIGO_BASE_URL, JSON_HEADERS } from "../config";
import type {
	FilterByDestinationRequest,
	FilterByDestinationResponse,
	FilterResultItem,
	FilterCompanySummary,
} from "@/types/filter-patners";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeResponse(payload: any): FilterByDestinationResponse {
	const results: FilterResultItem[] = Array.isArray(payload?.results)
		? payload.results
		: Array.isArray(payload?.data)
		? payload.data
		: [];

	const companies: FilterCompanySummary[] = Array.isArray(payload?.companies)
		? payload.companies
		: [];

	const count: number =
		typeof payload?.count === "number"
			? payload.count
			: (results?.length || companies?.length || 0);

	return {
		response: typeof payload?.response === "number" ? payload.response : 1,
		message: payload?.message || "OK",
		count,
		results,
		companies,
	};
}

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json().catch(() => ({}))) as FilterByDestinationRequest;
		const from_town = typeof body?.from_town === "string" ? body.from_town.trim() : undefined;
		const to_town = typeof body?.to_town === "string" ? body.to_town.trim() : undefined;

		if (!from_town && !to_town) {
			return NextResponse.json(
				{ error: "Provide at least one of from_town or to_town" },
				{ status: 400 }
			);
		}

		const payload: Required<Pick<FilterByDestinationRequest, "route">> &
			Partial<FilterByDestinationRequest> = {
			route: "FILTER-BY-DESTINATION",
			...(from_town ? { from_town } : {}),
			...(to_town ? { to_town } : {}),
		};

		const res = await fetch(MZIGO_BASE_URL, {
			method: "POST",
			headers: JSON_HEADERS,
			body: JSON.stringify(payload),
			cache: "no-store",
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: `HTTP ${res.status}: ${res.statusText}` },
				{ status: 500 }
			);
		}

		const data = await res.json();
		const normalized = normalizeResponse(data);
		return NextResponse.json(normalized, { status: 200 });
	} catch (error: any) {
		console.error("[api/filter-parteners] Failed:", error?.message || error);
		return NextResponse.json(
			{ error: error?.message || "Failed to filter partners" },
			{ status: 500 }
		);
	}
}

