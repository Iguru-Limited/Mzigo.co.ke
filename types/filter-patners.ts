// Types for filtering partners/companies by destination(s)

export interface FilterByDestinationRequest {
	// Always sent upstream; defaults to 'FILTER-BY-DESTINATION'
	route?: 'FILTER-BY-DESTINATION'
	// Provide at least one of from_town or to_town
	from_town?: string
	to_town?: string
}

export interface FilterCompanySummary {
	company_id: number
	company_name: string
}

export interface FilterResultItem extends FilterCompanySummary {
	from_destination_id?: number
	from_destination_name?: string
	from_count?: number
	from_route?: number
	to_destination_id?: number
	to_destination_name?: string
	to_count?: number
	to_route?: number
	phone_number?: string
}

export interface FilterByDestinationResponse {
	response: number
	message: string
	count?: number
	results?: FilterResultItem[]
	companies?: FilterCompanySummary[]
}

