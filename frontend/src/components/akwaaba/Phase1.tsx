import { useMemo, useState } from 'react'
import MapPanel from '../shared/MapPanel'
import type { LayerGroup } from '../shared/MapPanel'
import { useSubcompartments, useNurseryFence, useBibianiCentre, useOfficeLocation, usePrimaryRoads } from '../../api/akwaaba'
import type { OverlayLayer } from '../shared/MapPanel'

const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
  '#4ad96b', '#d9c84a', '#4a6cd9', '#d94a9a',
]

const CURRENT_YEAR = new Date().getFullYear()

const VALUE_LABELS: Record<string, string> = {
  'not planted': 'Planned',
}

function getDisplayLabel(value: string): string | undefined {
  return VALUE_LABELS[value.toLowerCase()]
}

const FIELDS: Array<{ id: string; label: string }> = [
  { id: 'planting_status', label: 'Planting Status' },
  { id: 'planting_type',   label: 'Recipe' },
  { id: 'year_planted',    label: 'Planting Year' },
  { id: 'age_years',       label: 'Age (planted)' },
]

interface Phase1Props {
  collapsed: boolean
  onCollapse: () => void
  bothVisible?: boolean
}

export default function Phase1({ collapsed, onCollapse, bothVisible }: Phase1Props) {
  const { data, isLoading, isError } = useSubcompartments()
  const { data: nurseryData }  = useNurseryFence()
  const { data: bibianiData }  = useBibianiCentre()
  const { data: officeData }   = useOfficeLocation()
  const { data: roadsData }    = usePrimaryRoads()
  const [colorField, setColorField] = useState<string>('')

  const processedData = useMemo(() => {
    if (!data) return null
    return {
      ...data,
      features: data.features.map(f => {
        const props = f.properties as unknown as Record<string, unknown>
        const yr = Number(props.year_planted)
        return { ...f, properties: { ...props, ...(yr > 0 ? { age_years: CURRENT_YEAR - yr } : {}) } }
      }),
    }
  }, [data])

  const overlayLayers: OverlayLayer[] = [
    { id: 'nursery-fence',   label: 'Nursery Fence',   data: nurseryData ?? null, type: 'polygon', color: '#f0c040', labelField: 'name' },
    { id: 'bibiani-centre',  label: 'Bibiani Centre',  data: bibianiData ?? null, type: 'point',   color: '#4a90d9' },
    { id: 'office-location', label: 'Office Location', data: officeData  ?? null, type: 'point',   color: '#e84a4a' },
    { id: 'primary-roads',   label: 'Primary Roads',   data: roadsData   ?? null, type: 'line',    color: '#e8a030' },
  ]

  const layerGroups = useMemo<LayerGroup[]>(() => {
    if (!processedData) return []
    return FIELDS.map(({ id, label }) => {
      const unique = [
        ...new Set(
          processedData.features
            .map(f => String((f.properties as unknown as Record<string, unknown>)[id] ?? ''))
            .filter(Boolean),
        ),
      ]
      if (id === 'age_years') {
        unique.sort((a, b) => Number(a) - Number(b))
        return {
          id, label,
          values: unique.map((value, i) => ({
            value,
            label: `${value} yr${Number(value) !== 1 ? 's' : ''}`,
            color: PALETTE[i % PALETTE.length],
          })),
        }
      }
      unique.sort()
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
  }, [processedData])

  // Radio toggle: activate the clicked field, or deactivate if already active
  const handleColorFieldChange = (field: string) => {
    setColorField(prev => (prev === field ? '' : field))
  }

  return (
    <MapPanel
      title="Phase 1"
      dotColor="#7ab060"
      initialLayers={[]}
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapseDirection="left"
      bothVisible={bothVisible}
      borderRight
      isLoading={isLoading}
      isError={isError}
      geoJsonData={processedData}
      layerGroups={layerGroups}
      colorField={colorField}
      onColorFieldChange={handleColorFieldChange}
      overlayLayers={overlayLayers}
    />
  )
}
