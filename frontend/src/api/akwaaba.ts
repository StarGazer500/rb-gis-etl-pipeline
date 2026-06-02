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

// ── Phase 2 ───────────────────────────────────────────────────────────────────

export interface Phase2Properties {
  id: number
  fid: string | null
  classname: string | null
  area_ha: number | null
  reserve_name: string | null
  treatment_type: string | null
  planting_type: string | null
}

export interface Phase2Feature {
  type: 'Feature'
  geometry: { type: string; coordinates: unknown } | null
  properties: Phase2Properties
}

export interface Phase2FeatureCollection {
  type: 'FeatureCollection'
  features: Phase2Feature[]
}

async function fetchPhase2(): Promise<Phase2FeatureCollection> {
  const res = await fetch(`${API_BASE}/api/akwaaba/layers/phase2`)
  if (!res.ok) throw new Error(`Failed to fetch phase2: ${res.status}`)
  return res.json()
}

export function usePhase2() {
  return useQuery({
    queryKey: ['akwaaba', 'phase2'],
    queryFn: fetchPhase2,
    staleTime: 5 * 60 * 1000,
  })
}

// ── Overlay layers ────────────────────────────────────────────────────────────

type GeoFeature<P> = { type: 'Feature'; geometry: { type: string; coordinates: unknown } | null; properties: P }
type GeoFC<P> = { type: 'FeatureCollection'; features: GeoFeature<P>[] }

export type NurseryFenceFC = GeoFC<{ fid: number; name: string | null; area: number | null }>
export type SimplePointFC  = GeoFC<{ id: number }>
export type RoadFC         = GeoFC<{ id: number; name: string | null; highway: string | null; surface: string | null }>

async function fetchLayer<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json()
}

export function useNurseryFence() {
  return useQuery({
    queryKey: ['akwaaba', 'nursery-fence'],
    queryFn: () => fetchLayer<NurseryFenceFC>('/api/akwaaba/layers/nursery-fence'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBibianiCentre() {
  return useQuery({
    queryKey: ['akwaaba', 'bibiani-centre'],
    queryFn: () => fetchLayer<SimplePointFC>('/api/akwaaba/layers/bibiani-centre'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useOfficeLocation() {
  return useQuery({
    queryKey: ['akwaaba', 'office-location'],
    queryFn: () => fetchLayer<SimplePointFC>('/api/akwaaba/layers/office-location'),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePrimaryRoads() {
  return useQuery({
    queryKey: ['akwaaba', 'primary-roads'],
    queryFn: () => fetchLayer<RoadFC>('/api/akwaaba/layers/primary-roads'),
    staleTime: 5 * 60 * 1000,
  })
}

// ── Lease Area Stratification ─────────────────────────────────────────────────

export type LeaseAreaFC = GeoFC<{ id: number; category: string | null; subcategory: string | null; area_ha: number | null }>

export function useAkwaabaLeaseAreas() {
  return useQuery({
    queryKey: ['akwaaba', 'lease-areas'],
    queryFn: () => fetchLayer<LeaseAreaFC>('/api/akwaaba/layers/lease-areas'),
    staleTime: 5 * 60 * 1000,
  })
}
