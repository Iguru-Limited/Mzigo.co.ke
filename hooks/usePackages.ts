'use client'

import { useState, useCallback } from 'react'
import { Parcel, Order } from '@/types'

interface UsePackagesReturn {
  packages: Order[]
  loading: boolean
  error: string | null
  createPackage: (data: Parcel) => Promise<boolean>
  updatePackage: (trackingNumber: string, data: Partial<Parcel>) => Promise<boolean>
  deletePackage: (trackingNumber: string) => Promise<boolean>
  getPackages: () => Order[]
}

export function usePackages(): UsePackagesReturn {
  const [packages, setPackages] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get packages from localStorage
  const getPackages = useCallback((): Order[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem('mzigoOrders')
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      console.error('[usePackages] Error reading packages:', err)
      return []
    }
  }, [])

  // Create a new package
  const createPackage = async (data: Parcel): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/register-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) {
        throw new Error(`Failed to create package: ${res.statusText}`)
      }
      
      const result = await res.json()
      
      // Update local state
      const updatedPackages = getPackages()
      setPackages(updatedPackages)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create package'
      setError(errorMessage)
      console.error('[usePackages] Create error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update a package
  const updatePackage = async (trackingNumber: string, data: Partial<Parcel>): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/update-package', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, ...data }),
      })
      
      if (!res.ok) {
        throw new Error(`Failed to update package: ${res.statusText}`)
      }
      
      // Update local state
      const updatedPackages = getPackages()
      setPackages(updatedPackages)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update package'
      setError(errorMessage)
      console.error('[usePackages] Update error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete a package
  const deletePackage = async (trackingNumber: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/delete-package', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber }),
      })
      
      if (!res.ok) {
        throw new Error(`Failed to delete package: ${res.statusText}`)
      }
      
      // Update local state
      const updatedPackages = getPackages()
      setPackages(updatedPackages)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete package'
      setError(errorMessage)
      console.error('[usePackages] Delete error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    packages,
    loading,
    error,
    createPackage,
    updatePackage,
    deletePackage,
    getPackages,
  }
}
