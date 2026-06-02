import { useQuery } from '@tanstack/react-query'
import type { LeaseAreaFC, SubcompartmentFeatureCollection } from './akwaaba'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function fetchSubcompartments(): Promise<SubcompartmentFeatureCollection> {
  const res = await fetch(`${API_BASE}/api/colobus/layers/subcompartments`)
  if (!res.ok) throw new Error(`Failed to fetch colobus subcompartments: ${res.status}`)
  return res.json()
}

export function useColobusSubcompartments() {
  return useQuery({
    queryKey: ['colobus', 'subcompartments'],
    queryFn: fetchSubcompartments,
    staleTime: 5 * 60 * 1000,
  })
}

export function useColobusLeaseAreas() {
  return useQuery({
    queryKey: ['colobus', 'lease-areas'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/colobus/layers/lease-areas`)
      if (!res.ok) throw new Error(`Failed to fetch colobus lease areas: ${res.status}`)
      return res.json() as Promise<LeaseAreaFC>
    },
    staleTime: 5 * 60 * 1000,
  })
}
