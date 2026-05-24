import { useQuery } from '@tanstack/react-query'

// Production: VITE_API_URL="" (relative path, nginx proxies /api/). Dev: falls back to localhost.
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface SubcompartmentProperties {
  id: number
  subcompartment_id: string | null
  compartment_id: string | null
  area_ha: number | null
  treatment_type: string | null
  planting_status: string | null
  year_planted: string | null
  planting_type: string | null
}

export interface SubcompartmentFeature {
  type: 'Feature'
  geometry: { type: string; coordinates: unknown } | null
  properties: SubcompartmentProperties
}

export interface SubcompartmentFeatureCollection {
  type: 'FeatureCollection'
  features: SubcompartmentFeature[]
}

async function fetchSubcompartments(): Promise<SubcompartmentFeatureCollection> {
  const res = await fetch(`${API_BASE}/api/akwaaba/layers/subcompartments`)
  if (!res.ok) throw new Error(`Failed to fetch subcompartments: ${res.status}`)
  return res.json()
}

export function useSubcompartments() {
  return useQuery({
    queryKey: ['akwaaba', 'subcompartments'],
    queryFn: fetchSubcompartments,
    staleTime: 5 * 60 * 1000,
  })
}
