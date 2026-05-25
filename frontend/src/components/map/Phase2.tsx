import { useMemo, useState } from 'react'
import MapPanel from './MapPanel'
import type { LayerGroup } from './MapPanel'
import { usePhase2, useNurseryFence, useBibianiCentre, useOfficeLocation, usePrimaryRoads } from '../../api/akwaaba'
import type { OverlayLayer } from './MapPanel'

const PALETTE = [
  '#e87a4a', '#7ab060', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
  '#4ad96b', '#d9c84a', '#4a6cd9', '#d94a9a',
]

const FIELDS = [
  { id: 'treatment_type', label: 'Treatment' },
  { id: 'planting_type',  label: 'Recipe' },
]

const VALUE_LABELS: Record<string, string> = {}

function getDisplayLabel(value: string): string | undefined {
  return VALUE_LABELS[value.toLowerCase()]
}

interface Phase2Props {
  collapsed: boolean
  onCollapse: () => void
  bothVisible?: boolean
}

export default function Phase2({ collapsed, onCollapse, bothVisible }: Phase2Props) {
  const { data, isLoading, isError } = usePhase2()
  const { data: nurseryData } = useNurseryFence()
  const { data: bibianiData } = useBibianiCentre()
  const { data: officeData }  = useOfficeLocation()
  const { data: roadsData }   = usePrimaryRoads()
  const [colorField, setColorField] = useState<string>('')

  const overlayLayers: OverlayLayer[] = [
    { id: 'nursery-fence',   label: 'Nursery Fence',   data: nurseryData ?? null, type: 'polygon', color: '#f0c040', labelField: 'name' },
    { id: 'bibiani-centre',  label: 'Bibiani Centre',  data: bibianiData ?? null, type: 'point',   color: '#4a90d9' },
    { id: 'office-location', label: 'Office Location', data: officeData  ?? null, type: 'point',   color: '#e84a4a' },
    { id: 'primary-roads',   label: 'Primary Roads',   data: roadsData   ?? null, type: 'line',    color: '#e8a030' },
  ]

  const layerGroups = useMemo<LayerGroup[]>(() => {
    if (!data) return []
    return FIELDS.map(({ id, label }) => {
      const unique = [
        ...new Set(
          data.features
            .map(f => (f.properties as unknown as Record<string, unknown>)[id])
            .filter((v): v is string | number => v != null)
            .map(String),
        ),
      ].sort()
      return {
        id,
        label,
        values: unique.map((value, i) => ({
          value,
          ...(getDisplayLabel(value) ? { label: getDisplayLabel(value) } : {}),
          color: PALETTE[i % PALETTE.length],
        })),
      }
    })
  }, [data])

  const handleColorFieldChange = (field: string) => {
    setColorField(prev => (prev === field ? '' : field))
  }

  return (
    <MapPanel
      title="Phase 2"
      dotColor="#e87a4a"
      initialLayers={[]}
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapseDirection="right"
      bothVisible={bothVisible}
      isLoading={isLoading}
      isError={isError}
      geoJsonData={data ?? null}
      layerGroups={layerGroups}
      colorField={colorField}
      onColorFieldChange={handleColorFieldChange}
      overlayLayers={overlayLayers}
    />
  )
}
