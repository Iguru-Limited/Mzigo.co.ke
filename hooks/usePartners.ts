'use client'

import { useState, useEffect } from 'react'
import { Company } from '@/types'

interface UsePartnersReturn {
  partners: Company[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePartners(): UsePartnersReturn {
  const [partners, setPartners] = useState<Company[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('[usePartners] Fetching partners...')
      const res = await fetch('/api/partners', { cache: 'no-store' })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch partners: ${res.statusText}`)
      }
      
      const data = await res.json()
      console.log('[usePartners] Received data:', data)
      console.log('[usePartners] Partners count:', data.partners?.length || 0)
      setPartners(data.partners || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch partners'
      setError(errorMessage)
      console.error('[usePartners] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  return {
    partners,
    loading,
    error,
    refetch: fetchPartners,
  }
}
