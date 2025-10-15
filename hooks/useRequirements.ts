'use client'

import { useState, useEffect } from 'react'
import { PackageRequirement } from '@/types'

interface UseRequirementsReturn {
  requirements: PackageRequirement[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRequirements(): UseRequirementsReturn {
  const [requirements, setRequirements] = useState<PackageRequirement[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequirements = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/requirements', { cache: 'no-store' })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch requirements: ${res.statusText}`)
      }
      
      const data = await res.json()
      setRequirements(data.requirements || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch requirements'
      setError(errorMessage)
      console.error('[useRequirements] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequirements()
  }, [])

  return {
    requirements,
    loading,
    error,
    refetch: fetchRequirements,
  }
}
