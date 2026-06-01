import { useQuery } from '@tanstack/react-query'
import type { SubcompartmentFeatureCollection } from './akwaaba'

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
