import { useMemo, useState } from 'react'
import MapPanel from './MapPanel'
import type { LayerGroup } from './MapPanel'
import { useSubcompartments } from '../../api/akwaaba'

const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
  '#4ad96b', '#d9c84a', '#4a6cd9', '#d94a9a',
]

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
]

interface Phase1Props {
  collapsed: boolean
  onCollapse: () => void
  bothVisible?: boolean
}

export default function Phase1({ collapsed, onCollapse, bothVisible }: Phase1Props) {
  const { data, isLoading, isError } = useSubcompartments()
  // Empty string = no active categorisation (features shown in default colour)
  const [colorField, setColorField] = useState<string>('')

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
      geoJsonData={data ?? null}
      layerGroups={layerGroups}
      colorField={colorField}
      onColorFieldChange={handleColorFieldChange}
    />
  )
}
