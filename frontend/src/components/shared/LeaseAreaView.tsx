import { useMemo, useState } from 'react'
import MapPanel from './MapPanel'
import type { LayerGroup, GeoJSONFeatureCollection } from './MapPanel'

const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
  '#4ad96b', '#d9c84a', '#4a6cd9', '#d94a9a',
]

const FIELDS: Array<{ id: string; label: string }> = [
  { id: 'category',    label: 'Category' },
  { id: 'subcategory', label: 'Sub-category' },
]

export interface LeaseAreaViewProps {
  title: string
  dotColor: string
  data: GeoJSONFeatureCollection | undefined
  isLoading: boolean
  isError: boolean
}

export default function LeaseAreaView({ title, dotColor, data, isLoading, isError }: LeaseAreaViewProps) {
  const [colorField, setColorField] = useState('')

  const layerGroups = useMemo<LayerGroup[]>(() => {
    if (!data) return []
    return FIELDS.map(({ id, label }) => {
      const unique = [
        ...new Set(
          data.features
            .map(f => String((f.properties as Record<string, unknown>)[id] ?? ''))
            .filter(Boolean),
        ),
      ].sort()
      return {
        id,
        label,
        values: unique.map((value, i) => ({
          value,
          color: PALETTE[i % PALETTE.length],
        })),
      }
    })
  }, [data])

  return (
    <MapPanel
      title={title}
      dotColor={dotColor}
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
      onColorFieldChange={field => setColorField(prev => (prev === field ? '' : field))}
    />
  )
}
