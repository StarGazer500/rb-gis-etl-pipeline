import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON as GeoJSONLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { BASE_MAPS, type BaseMapKey } from '../shared/baseMaps'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'
import {
  useSubcompartments,
  usePhase2,
  useNurseryFence,
  useBibianiCentre,
  useOfficeLocation,
  usePrimaryRoads,
} from '../../api/akwaaba'

// ── Palette & labels ──────────────────────────────────────────────────────────

const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
  '#4ad96b', '#d9c84a', '#4a6cd9', '#d94a9a',
]

const VALUE_LABELS: Record<string, string> = { 'not planted': 'Planned' }
function displayLabel(v: string) { return VALUE_LABELS[v.toLowerCase()] ?? v }

function buildColorMap(
  features: { properties: Record<string, unknown> }[],
  field: string,
): Record<string, string> {
  const unique = [
    ...new Set(features.map((f) => String(f.properties[field] ?? '')).filter(Boolean)),
  ].sort()
  return Object.fromEntries(unique.map((v, i) => [v, PALETTE[i % PALETTE.length]]))
}

// ── Field configs ─────────────────────────────────────────────────────────────

const P1_FIELDS = [
  { id: 'planting_status', label: 'Planting Status' },
  { id: 'planting_type',   label: 'Recipe' },
  { id: 'year_planted',    label: 'Planting Year' },
]

const P2_FIELDS = [
  { id: 'treatment_type', label: 'Treatment' },
  { id: 'planting_type',  label: 'Recipe' },
]

// ── Overlay layer definitions ─────────────────────────────────────────────────

interface LayerDef {
  id: string
  label: string
  color: string
  type: 'polygon' | 'point' | 'line'
  labelField?: string
}

const OVERLAY_DEFS: LayerDef[] = [
  { id: 'nursery-fence',   label: 'Nursery Fence',   color: '#f0c040', type: 'polygon', labelField: 'name' },
  { id: 'primary-roads',   label: 'Primary Roads',   color: '#e8a030', type: 'line' },
  { id: 'bibiani-centre',  label: 'Bibiani Centre',  color: '#4a90d9', type: 'point' },
  { id: 'office-location', label: 'Office Location', color: '#e84a4a', type: 'point' },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

const LayersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)
const ChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15" />
  </svg>
)
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// ── Toggle button ─────────────────────────────────────────────────────────────

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        active ? 'bg-[#4a8c2a]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
          active ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ── Map auto-fit ──────────────────────────────────────────────────────────────

function MapFitter({ data }: { data: GeoJSONFeatureCollection | null }) {
  const map = useMap()
  useEffect(() => {
    if (!data?.features.length) return
    const bounds = L.geoJSON(data as unknown as Parameters<typeof L.geoJSON>[0]).getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [5, 5] })
  }, [data, map])
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CombinedView() {
  const { data: p1Data, isLoading } = useSubcompartments()
  const { data: p2Data }    = usePhase2()
  const { data: nurseryData } = useNurseryFence()
  const { data: bibianiData } = useBibianiCentre()
  const { data: officeData }  = useOfficeLocation()
  const { data: roadsData }   = usePrimaryRoads()

  const [activeBase, setActiveBase]       = useState<BaseMapKey>('Satellite')
  const [layerPanelOpen, setLayerPanelOpen] = useState(true)
  const [p1Visible, setP1Visible]         = useState(true)
  const [p2Visible, setP2Visible]         = useState(true)
  const [p1ColorField, setP1ColorField]   = useState('')
  const [p2ColorField, setP2ColorField]   = useState('')
  const [overlayVisible, setOverlayVisible] = useState<Record<string, boolean>>(
    () => Object.fromEntries(OVERLAY_DEFS.map((l) => [l.id, true])),
  )

  const overlayDataMap: Record<string, GeoJSONFeatureCollection | null> = {
    'nursery-fence':   nurseryData ?? null,
    'primary-roads':   roadsData   ?? null,
    'bibiani-centre':  bibianiData ?? null,
    'office-location': officeData  ?? null,
  }

  // Pre-build color maps for every classification field
  const p1ColorMaps = useMemo(() => {
    if (!p1Data) return {} as Record<string, Record<string, string>>
    const feats = p1Data.features.map((f) => ({ properties: f.properties as unknown as Record<string, unknown> }))
    return Object.fromEntries(P1_FIELDS.map(({ id }) => [id, buildColorMap(feats, id)]))
  }, [p1Data])

  const p2ColorMaps = useMemo(() => {
    if (!p2Data) return {} as Record<string, Record<string, string>>
    const feats = p2Data.features.map((f) => ({ properties: f.properties as unknown as Record<string, unknown> }))
    return Object.fromEntries(P2_FIELDS.map(({ id }) => [id, buildColorMap(feats, id)]))
  }, [p2Data])

  const toggleOverlay = (id: string) =>
    setOverlayVisible((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="relative flex-1 flex flex-col min-w-0">
      {/* Panel header */}
      <div className="h-9 bg-[#1e3d10] flex items-center px-3 border-b border-[#2d5a18] shrink-0">
        <span className="w-2 h-2 rounded-full bg-white mr-2" />
        <span className="text-white text-sm font-medium">Combined View</span>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer center={[7.9465, -1.0232]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            key={activeBase}
            url={BASE_MAPS[activeBase].url}
            attribution={BASE_MAPS[activeBase].attribution}
          />

          {/* Phase 1 */}
          {p1Visible && p1Data && (
            <GeoJSONLayer
              key={`p1-${p1ColorField || 'default'}`}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={p1Data as any}
              style={(feature) => {
                const props = (feature?.properties ?? {}) as Record<string, unknown>
                if (!p1ColorField) {
                  return { fillColor: '#7ab060', weight: 0.8, color: '#0d1f0a', fillOpacity: 0.45 }
                }
                const val = String(props[p1ColorField] ?? '')
                return {
                  fillColor: p1ColorMaps[p1ColorField]?.[val] ?? '#7ab060',
                  weight: 0.8, color: '#0d1f0a', fillOpacity: 0.55,
                }
              }}
            />
          )}

          {/* Phase 2 */}
          {p2Visible && p2Data && (
            <GeoJSONLayer
              key={`p2-${p2ColorField || 'default'}`}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={p2Data as any}
              style={(feature) => {
                const props = (feature?.properties ?? {}) as Record<string, unknown>
                if (!p2ColorField) {
                  return { fillColor: '#e87a4a', weight: 0.8, color: '#0d1f0a', fillOpacity: 0.45 }
                }
                const val = String(props[p2ColorField] ?? '')
                return {
                  fillColor: p2ColorMaps[p2ColorField]?.[val] ?? '#e87a4a',
                  weight: 0.8, color: '#0d1f0a', fillOpacity: 0.55,
                }
              }}
            />
          )}

          {/* Overlay layers */}
          {OVERLAY_DEFS.map((def) => {
            const data = overlayDataMap[def.id]
            if (!data || !overlayVisible[def.id]) return null
            return (
              <GeoJSONLayer
                key={def.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data as any}
                style={() =>
                  def.type === 'line'
                    ? { color: def.color, weight: 2.5, opacity: 0.85, fillOpacity: 0 }
                    : { fillColor: def.color, color: '#fff', weight: 2, fillOpacity: 0.7 }
                }
                onEachFeature={
                  def.labelField
                    ? (feature, layer) => {
                        const val = (feature.properties as Record<string, unknown>)?.[def.labelField!]
                        if (val) {
                          layer.bindTooltip(String(val), {
                            permanent: true,
                            direction: 'center',
                            className: 'overlay-label',
                          })
                        }
                      }
                    : undefined
                }
                pointToLayer={
                  def.type === 'point'
                    ? (_feat, latlng) =>
                        L.marker(latlng, {
                          icon: L.divIcon({
                            className: '',
                            iconAnchor: [14, 14],
                            html: `
                              <div style="text-align:center;width:28px;">
                                <div style="
                                  width:28px;height:28px;border-radius:50%;
                                  background:${def.color};border:3px solid #fff;
                                  box-shadow:0 1px 5px rgba(0,0,0,0.5);
                                "></div>
                                <div style="
                                  margin-top:3px;font-size:11px;font-weight:700;
                                  color:#1a3a0a;white-space:nowrap;
                                  text-shadow:1px 1px 0 #fff,-1px -1px 0 #fff,
                                              1px -1px 0 #fff,-1px 1px 0 #fff;
                                  transform:translateX(calc(-50% + 14px));
                                  display:inline-block;
                                ">${def.label}</div>
                              </div>`,
                          }),
                        })
                    : undefined
                }
              />
            )
          })}

          <MapFitter data={(p1Data ?? null) as unknown as GeoJSONFeatureCollection | null} />
        </MapContainer>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1f0a]/60 z-[900]">
            <span className="text-[#7ab060] text-sm animate-pulse">Loading layers…</span>
          </div>
        )}

        {/* Layer panel — anchored top-2/bottom-6 so it never overflows the map */}
        <div className="absolute top-2 bottom-6 right-4 z-[1000] w-60 flex flex-col justify-end pointer-events-none">
          <div className="pointer-events-auto bg-white/96 border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setLayerPanelOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg shrink-0"
          >
            <div className="flex items-center gap-2">
              <LayersIcon />
              <span className="text-sm font-semibold">Layers</span>
            </div>
            {layerPanelOpen ? <ChevronDown /> : <ChevronUp />}
          </button>

          {layerPanelOpen && (
            <div className="overflow-y-auto min-h-0">
              {/* ── Phase 1 ──────────────────────────────────────────── */}
              <div className="border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm shrink-0 bg-[#7ab060]" />
                    <span className="text-gray-700 text-sm font-medium">Phase 1</span>
                  </div>
                  <Toggle active={p1Visible} onClick={() => setP1Visible((v) => !v)} />
                </div>

                {p1Visible && (
                  <div className="ml-3 mr-2 mb-2 border-l border-gray-200">
                    {P1_FIELDS.map(({ id, label }) => {
                      const isActive = p1ColorField === id
                      const colorMap = p1ColorMaps[id] ?? {}
                      return (
                        <div key={id}>
                          <div className="flex items-center justify-between pl-3 pr-2 py-1.5">
                            <span className="text-gray-500 text-xs">{label}</span>
                            <Toggle
                              active={isActive}
                              onClick={() => setP1ColorField((prev) => (prev === id ? '' : id))}
                            />
                          </div>
                          {isActive && (
                            <div className="pl-3 pr-2 pb-2 space-y-1 max-h-28 overflow-y-auto">
                              {Object.entries(colorMap).map(([val, color]) => (
                                <div key={val} className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                                  <span className="text-gray-500 text-xs truncate">{displayLabel(val) || '—'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ── Phase 2 ──────────────────────────────────────────── */}
              <div className="border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm shrink-0 bg-[#e87a4a]" />
                    <span className="text-gray-700 text-sm font-medium">Phase 2</span>
                  </div>
                  <Toggle active={p2Visible} onClick={() => setP2Visible((v) => !v)} />
                </div>

                {p2Visible && (
                  <div className="ml-3 mr-2 mb-2 border-l border-gray-200">
                    {P2_FIELDS.map(({ id, label }) => {
                      const isActive = p2ColorField === id
                      const colorMap = p2ColorMaps[id] ?? {}
                      return (
                        <div key={id}>
                          <div className="flex items-center justify-between pl-3 pr-2 py-1.5">
                            <span className="text-gray-500 text-xs">{label}</span>
                            <Toggle
                              active={isActive}
                              onClick={() => setP2ColorField((prev) => (prev === id ? '' : id))}
                            />
                          </div>
                          {isActive && (
                            <div className="pl-3 pr-2 pb-2 space-y-1 max-h-28 overflow-y-auto">
                              {Object.entries(colorMap).map(([val, color]) => (
                                <div key={val} className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                                  <span className="text-gray-500 text-xs truncate">{displayLabel(val) || '—'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ── Overlays ─────────────────────────────────────────── */}
              <div className="border-t border-gray-100 px-3 py-2 space-y-2.5">
                {OVERLAY_DEFS.map((def) => (
                  <div key={def.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {def.type === 'line' ? (
                        <span className="w-3 h-0.5 shrink-0 rounded-full" style={{ backgroundColor: def.color }} />
                      ) : (
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: def.color }} />
                      )}
                      <span className="text-gray-700 text-sm">{def.label}</span>
                    </div>
                    <Toggle
                      active={overlayVisible[def.id]}
                      onClick={() => toggleOverlay(def.id)}
                    />
                  </div>
                ))}
              </div>

              {/* ── Base map ─────────────────────────────────────────── */}
              <div className="border-t border-gray-100 px-3 py-2.5">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider font-medium mb-2">Base Map</p>
                <div className="flex gap-1">
                  {(Object.keys(BASE_MAPS) as BaseMapKey[]).map((bm) => (
                    <button
                      key={bm}
                      onClick={() => setActiveBase(bm)}
                      className={`flex-1 py-1 text-xs rounded transition-colors ${
                        activeBase === bm
                          ? 'bg-[#4a8c2a] text-white font-medium'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {bm}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
