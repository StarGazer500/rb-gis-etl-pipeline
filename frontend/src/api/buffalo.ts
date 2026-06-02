import { useQuery } from '@tanstack/react-query'
import type { LeaseAreaFC, SubcompartmentFeatureCollection } from './akwaaba'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function fetchSubcompartments(): Promise<SubcompartmentFeatureCollection> {
  const res = await fetch(`${API_BASE}/api/buffalo/layers/subcompartments`)
  if (!res.ok) throw new Error(`Failed to fetch buffalo subcompartments: ${res.status}`)
  return res.json()
}

export function useBuffaloSubcompartments() {
  return useQuery({
    queryKey: ['buffalo', 'subcompartments'],
    queryFn: fetchSubcompartments,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBuffaloLeaseAreas() {
  return useQuery({
    queryKey: ['buffalo', 'lease-areas'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/buffalo/layers/lease-areas`)
      if (!res.ok) throw new Error(`Failed to fetch buffalo lease areas: ${res.status}`)
      return res.json() as Promise<LeaseAreaFC>
    },
    staleTime: 5 * 60 * 1000,
  })
}
