'use client'

import { useState, useEffect } from 'react'
import { PackageDestination } from '@/types'

interface UseDestinationsReturn {
  destinations: PackageDestination[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDestinations(): UseDestinationsReturn {
  const [destinations, setDestinations] = useState<PackageDestination[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDestinations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/destinations', { cache: 'no-store' })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch destinations: ${res.statusText}`)
      }
      
      const data = await res.json()
      setDestinations(data.destinations || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch destinations'
      setError(errorMessage)
      console.error('[useDestinations] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [])

  return {
    destinations,
    loading,
    error,
    refetch: fetchDestinations,
  }
}
