import { useMemo, useState } from 'react'
import MapPanel from '../shared/MapPanel'
import type { LayerGroup } from '../shared/MapPanel'
import { useColobusSubcompartments } from '../../api/colobus'

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

export default function ColobusMapView() {
  const { data, isLoading, isError } = useColobusSubcompartments()
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

  return (
    <MapPanel
      title="Colobus Reserve"
      dotColor="#e87a4a"
      initialLayers={[]}
      collapsed={false}
      onCollapse={() => {}}
      collapseDirection="left"
      showCollapse={false}
      isLoading={isLoading}
      isError={isError}
      geoJsonData={processedData}
      layerGroups={layerGroups}
      colorField={colorField}
      onColorFieldChange={(field) => setColorField(prev => prev === field ? '' : field)}
    />
  )
}
