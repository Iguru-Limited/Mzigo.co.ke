'use client'

import { useState, useCallback } from 'react'
import type {
  FilterByDestinationResponse,
  FilterCompanySummary,
  FilterResultItem,
} from '@/types/filter-patners'

export interface FilterParams {
  from_town?: string
  to_town?: string
}

export interface UseFilterPartnersReturn {
  results: FilterResultItem[]
  companies: FilterCompanySummary[]
  count: number
  loading: boolean
  error: string | null
  message: string | null
  filterPartners: (params: FilterParams) => Promise<boolean>
  reset: () => void
}

export function useFilterPartners(): UseFilterPartnersReturn {
  const [results, setResults] = useState<FilterResultItem[]>([])
  const [companies, setCompanies] = useState<FilterCompanySummary[]>([])
  const [count, setCount] = useState<number>(0)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setResults([])
    setCompanies([])
    setCount(0)
    setMessage(null)
    setError(null)
  }, [])

  const filterPartners = useCallback(async (params: FilterParams): Promise<boolean> => {
    const { from_town, to_town } = params || {}
    if (!from_town && !to_town) {
      setError('Provide at least one of from_town or to_town')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/filter-parteners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_town, to_town }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Request failed: ${res.status}`)
      }

      const data: FilterByDestinationResponse | { error?: string } = await res.json()

      if ((data as any)?.error) {
        throw new Error((data as any).error)
      }

      const normalized = data as FilterByDestinationResponse
      setResults(normalized.results || [])
      setCompanies(normalized.companies || [])
      setCount(typeof normalized.count === 'number' ? normalized.count : (normalized.results?.length || normalized.companies?.length || 0))
      setMessage(normalized.message || null)
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to filter partners'
      setError(msg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    results,
    companies,
    count,
    loading,
    error,
    message,
    filterPartners,
    reset,
  }
}
