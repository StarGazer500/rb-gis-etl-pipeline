import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON as GeoJSONLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { BASE_MAPS, type BaseMapKey } from './baseMaps'
export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: { type: 'Feature'; geometry: unknown; properties: unknown }[]
}

// ── Exported types ────────────────────────────────────────────────────────────

export interface Layer {
  id: string
  label: string
  color: string
  visible: boolean
}

export interface LayerValue {
  value: string
  label?: string
  color: string
  visible?: boolean
}

export interface LayerGroup {
  id: string
  label: string
  values: LayerValue[]
}

export interface OverlayLayer {
  id: string
  label: string
  data: GeoJSONFeatureCollection | null
  type: 'point' | 'polygon' | 'line'
  color: string
  labelField?: string
}

export interface MapPanelProps {
  title: string
  dotColor: string
  initialLayers: Layer[]
  collapsed: boolean
  onCollapse: () => void
  collapseDirection: 'left' | 'right'
  bothVisible?: boolean
  borderRight?: boolean
  center?: [number, number]
  zoom?: number
  isLoading?: boolean
  isError?: boolean
  geoJsonData?: GeoJSONFeatureCollection | null
  layerGroups?: LayerGroup[]
  colorField?: string
  onColorFieldChange?: (field: string) => void
  overlayLayers?: OverlayLayer[]
  showCollapse?: boolean
}

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

const CollapseArrow = ({ direction }: { direction: 'left' | 'right' }) =>
  direction === 'left' ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )

// ── Map helpers ───────────────────────────────────────────────────────────────

function MapController({
  bothVisible,
  data,
}: {
  bothVisible: boolean
  data: GeoJSONFeatureCollection | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!data?.features.length) return
    const fit = () => {
      map.invalidateSize()
      const bounds = L.geoJSON(data as unknown as Parameters<typeof L.geoJSON>[0]).getBounds()
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [5, 5] })
    }
    // whenReady fires after Leaflet has measured the container — handles both
    // fresh mounts and navigating back when data is already in the query cache.
    if (map.getContainer().clientWidth > 0) {
      fit()
    } else {
      map.whenReady(fit)
    }
  }, [data, map])

  // Invalidate size after panel resize — rAF ensures the browser has finished
  // the flex layout recalculation before Leaflet measures the container
  useEffect(() => {
    const raf = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(raf)
  }, [bothVisible, map])

  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MapPanel({
  title,
  dotColor,
  initialLayers,
  collapsed,
  onCollapse,
  collapseDirection,
  bothVisible = false,
  borderRight = false,
  center = [7.9465, -1.0232],
  zoom = 10,
  isLoading = false,
  isError = false,
  geoJsonData = null,
  layerGroups,
  colorField,
  onColorFieldChange,
  overlayLayers = [],
  showCollapse = true,
}: MapPanelProps) {
  const [layers, setLayers] = useState<Layer[]>(initialLayers)
  const [activeBase, setActiveBase] = useState<BaseMapKey>('Satellite')
  const [layerPanelOpen, setLayerPanelOpen] = useState(true)

  const toggleLayer = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))
  }

  // Re-key the GeoJSON layer when colorField changes so Leaflet re-applies styles.
  const geoJsonKey = colorField || 'default'

  if (collapsed) return null

  const hasDynamicLayers = layerGroups && layerGroups.length > 0

  return (
    <div className={`relative flex-1 flex flex-col min-w-0 ${borderRight ? 'border-r border-[#2d5a18]' : ''}`}>
      {/* Panel header */}
      <div className="h-9 bg-[#1e3d10] flex items-center justify-between px-3 border-b border-[#2d5a18] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-white text-sm font-medium">{title}</span>
        </div>
        {showCollapse && (
          <button
            onClick={onCollapse}
            className="text-[#a8c896] hover:text-white transition-colors flex items-center gap-1 text-xs"
          >
            {collapseDirection === 'left' && <CollapseArrow direction="left" />}
            Collapse
            {collapseDirection === 'right' && <CollapseArrow direction="right" />}
          </button>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            key={activeBase}
            url={BASE_MAPS[activeBase].url}
            attribution={BASE_MAPS[activeBase].attribution}
          />

          {geoJsonData && hasDynamicLayers && (
            <GeoJSONLayer
              key={geoJsonKey}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={geoJsonData as any}
              style={(feature) => {
                const props = (feature?.properties ?? {}) as Record<string, unknown>
                if (!colorField) {
                  return { fillColor: '#7ab060', weight: 0.8, color: '#0d1f0a', fillOpacity: 0.35 }
                }
                const colorGroup = layerGroups.find((g) => g.id === colorField)
                const propVal = String(props[colorField] ?? 'Unknown')
                const colorEntry = colorGroup?.values.find((v) => v.value === propVal)
                return {
                  fillColor: colorEntry?.color ?? '#7ab060',
                  weight: 0.8,
                  color: '#0d1f0a',
                  fillOpacity: 0.55,
                }
              }}
            />
          )}

          {overlayLayers.map((ol) =>
            ol.data ? (
              <GeoJSONLayer
                key={ol.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={ol.data as any}
                style={() =>
                  ol.type === 'line'
                    ? { color: ol.color, weight: 2.5, opacity: 0.85, fillOpacity: 0 }
                    : { fillColor: ol.color, color: '#fff', weight: 2, fillOpacity: 0.7 }
                }
                onEachFeature={
                  ol.labelField
                    ? (feature, layer) => {
                        const val = (feature.properties as Record<string, unknown>)?.[ol.labelField!]
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
                  ol.type === 'point'
                    ? (_feat, latlng) =>
                        L.marker(latlng, {
                          icon: L.divIcon({
                            className: '',
                            iconAnchor: [14, 14],
                            html: `
                              <div style="text-align:center;width:28px;">
                                <div style="
                                  width:28px;height:28px;border-radius:50%;
                                  background:${ol.color};border:3px solid #fff;
                                  box-shadow:0 1px 5px rgba(0,0,0,0.5);
                                "></div>
                                <div style="
                                  margin-top:3px;font-size:11px;font-weight:700;
                                  color:#1a3a0a;white-space:nowrap;
                                  text-shadow:1px 1px 0 #fff,-1px -1px 0 #fff,
                                              1px -1px 0 #fff,-1px 1px 0 #fff;
                                  transform:translateX(calc(-50% + 14px));
                                  display:inline-block;
                                ">${ol.label}</div>
                              </div>`,
                          }),
                        })
                    : undefined
                }
              />
            ) : null,
          )}

          <MapController bothVisible={bothVisible} data={geoJsonData ?? null} />
        </MapContainer>

        {/* Loading / error overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1f0a]/60 z-[900]">
            <span className="text-[#7ab060] text-sm animate-pulse">Loading layers…</span>
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1f0a]/60 z-[900]">
            <span className="text-[#e87a4a] text-sm">Failed to load layer data</span>
          </div>
        )}

        {/* Layer panel overlay */}
        <div className={`absolute ${bothVisible ? 'bottom-10' : 'bottom-6'} right-4 z-[1000] w-56 bg-white/96 border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm`}>
          <button
            onClick={() => setLayerPanelOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-2">
              <LayersIcon />
              <span className="text-sm font-semibold">Layers</span>
            </div>
            {layerPanelOpen ? <ChevronDown /> : <ChevronUp />}
          </button>

          {layerPanelOpen && (
            <>
              {/* ── Dynamic layer groups (Phase 1) ─────────────────────── */}
              {hasDynamicLayers ? (
                <div className="border-t border-gray-100">
                  {layerGroups.map((group) => {
                    const isActive = colorField === group.id
                    return (
                      <div key={group.id} className="border-b border-gray-100 last:border-b-0">
                        {/* Layer row: label + toggle */}
                        <div className="flex items-center justify-between px-3 py-2.5">
                          <span className="text-gray-700 text-sm font-medium">{group.label}</span>
                          <button
                            onClick={() => onColorFieldChange?.(group.id)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                              isActive ? 'bg-[#4a8c2a]' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                                isActive ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Legend — only shown when active */}
                        {isActive && (
                          <div className="px-3 pb-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                            {group.values.map((val) => (
                              <div key={val.value} className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-sm shrink-0"
                                  style={{ backgroundColor: val.color }}
                                />
                                <span className="text-gray-600 text-xs truncate">
                                  {(val.label ?? val.value) || '—'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ── Static layer toggles (Phase 2) ───────────────────── */
                <div className="border-t border-gray-100 px-3 py-2 space-y-2.5">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: layer.color }} />
                        <span className="text-gray-700 text-sm">{layer.label}</span>
                      </div>
                      <button
                        onClick={() => toggleLayer(layer.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          layer.visible ? 'bg-[#4a8c2a]' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                            layer.visible ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Base map selector (always shown) */}
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
            </>
          )}
        </div>
      </div>

    </div>
  )
}
