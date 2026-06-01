import { useMemo, useState } from 'react'
import MapPanel from './MapPanel'
import type { LayerGroup, GeoJSONFeatureCollection } from './MapPanel'

const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
  '#4ad96b', '#d9c84a', '#4a6cd9', '#d94a9a',
]

const VALUE_LABELS: Record<string, string> = {
  'not planted': 'Planned',
}

const FIELDS: Array<{ id: string; label: string }> = [
  { id: 'planting_status', label: 'Planting Status' },
  { id: 'planting_type',   label: 'Recipe' },
]

export interface CurrentYearViewProps {
  title: string
  dotColor: string
  data: GeoJSONFeatureCollection | undefined
  isLoading: boolean
  isError: boolean
}

export default function CurrentYearView({ title, dotColor, data, isLoading, isError }: CurrentYearViewProps) {
  const [colorField, setColorField] = useState('')

  const maxYear = useMemo(() => {
    if (!data?.features.length) return null
    const years = data.features
      .map(f => Number((f.properties as Record<string, unknown>).year_planted))
      .filter(y => !isNaN(y) && y > 0)
    return years.length ? Math.max(...years) : null
  }, [data])

  const filteredData = useMemo<GeoJSONFeatureCollection | null>(() => {
    if (!data || maxYear === null) return null
    return {
      ...data,
      features: data.features.filter(
        f => Number((f.properties as Record<string, unknown>).year_planted) === maxYear,
      ),
    }
  }, [data, maxYear])

  const layerGroups = useMemo<LayerGroup[]>(() => {
    if (!filteredData) return []
    return FIELDS.map(({ id, label }) => {
      const unique = [
        ...new Set(
          filteredData.features
            .map(f => (f.properties as Record<string, unknown>)[id])
            .filter((v): v is string | number => v != null)
            .map(String),
        ),
      ].sort()
      return {
        id,
        label,
        values: unique.map((value, i) => ({
          value,
          ...(VALUE_LABELS[value.toLowerCase()] ? { label: VALUE_LABELS[value.toLowerCase()] } : {}),
          color: PALETTE[i % PALETTE.length],
        })),
      }
    })
  }, [filteredData])

  const panelTitle = maxYear ? `${title} — ${maxYear}` : title

  return (
    <MapPanel
      title={panelTitle}
      dotColor={dotColor}
      initialLayers={[]}
      collapsed={false}
      onCollapse={() => {}}
      collapseDirection="left"
      showCollapse={false}
      isLoading={isLoading}
      isError={isError}
      geoJsonData={filteredData}
      layerGroups={layerGroups}
      colorField={colorField}
      onColorFieldChange={field => setColorField(prev => (prev === field ? '' : field))}
    />
  )
}
