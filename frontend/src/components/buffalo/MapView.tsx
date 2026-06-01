import { useMemo, useState } from 'react'
import MapPanel from '../shared/MapPanel'
import type { LayerGroup } from '../shared/MapPanel'
import { useBuffaloSubcompartments } from '../../api/buffalo'

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

export default function BuffaloMapView() {
  const { data, isLoading, isError } = useBuffaloSubcompartments()
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

  return (
    <MapPanel
      title="Buffalo Reserve"
      dotColor="#7ab060"
      initialLayers={[]}
      collapsed={false}
      onCollapse={() => {}}
      collapseDirection="left"
      showCollapse={false}
      isLoading={isLoading}
      isError={isError}
      geoJsonData={data ?? null}
      layerGroups={layerGroups}
      colorField={colorField}
      onColorFieldChange={(field) => setColorField(prev => prev === field ? '' : field)}
    />
  )
}
