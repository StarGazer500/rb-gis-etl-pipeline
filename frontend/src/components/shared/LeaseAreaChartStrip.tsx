import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import type { GeoJSONFeatureCollection } from './MapPanel'

const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
]

function aggregateArea(
  features: { properties: Record<string, unknown> }[],
  field: string,
): { name: string; area: number; color: string }[] {
  const totals: Record<string, number> = {}
  features.forEach((f) => {
    const key = String(f.properties[field] ?? '').trim()
    if (!key) return
    totals[key] = (totals[key] ?? 0) + (Number(f.properties['area_ha']) || 0)
  })
  return Object.entries(totals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, area], i) => ({
      name,
      area: Math.round(area * 10) / 10,
      color: PALETTE[i % PALETTE.length],
    }))
}

function MiniChart({ title, data }: { title: string; data: { name: string; area: number; color: string }[] }) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <p className="text-[#a8c896] text-[11px] font-semibold uppercase tracking-wider mb-1 px-1 truncate">
        {title}
      </p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 2, right: 8, left: -18, bottom: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3d10" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#a8c896', fontSize: 9 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fill: '#a8c896', fontSize: 9 }} width={36} />
            <Tooltip
              formatter={(v) => [`${v} ha`, 'Area']}
              contentStyle={{ background: '#1a3a0a', border: '1px solid #2d5a18', borderRadius: 6 }}
              labelStyle={{ color: '#fff', fontSize: 11 }}
              itemStyle={{ color: '#a8c896', fontSize: 11 }}
              cursor={{ fill: '#2d5a18', opacity: 0.35 }}
            />
            <Bar
              dataKey="area"
              maxBarSize={40}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const { x, y, width, height, index } = props
                return (
                  <rect
                    x={x} y={y} width={width}
                    height={Math.max(height, 0)}
                    rx={3} ry={3}
                    fill={data[index]?.color ?? '#7ab060'}
                  />
                )
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

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

export interface LeaseAreaChartStripProps {
  projectLabel: string
  labelColor: string
  data: GeoJSONFeatureCollection | undefined
}

export default function LeaseAreaChartStrip({ projectLabel, labelColor, data }: LeaseAreaChartStripProps) {
  const [open, setOpen] = useState(true)

  const features = useMemo(
    () => (data?.features ?? []).map(f => ({ properties: f.properties as Record<string, unknown> })),
    [data],
  )

  const category    = useMemo(() => aggregateArea(features, 'category'),    [features])
  const subcategory = useMemo(() => aggregateArea(features, 'subcategory'), [features])

  return (
    <div className="shrink-0 bg-[#0d1f0a] border-t border-[#2d5a18]">
      <div className="h-8 flex items-center justify-between px-4 border-b border-[#2d5a18]">
        <span className="text-[#a8c896] text-xs font-semibold uppercase tracking-wider">Analytics</span>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-[#a8c896] hover:text-white transition-colors"
        >
          {open ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      {open && (
        <div className="h-52 flex px-3 py-2">
          <div className="flex flex-col flex-1 min-w-0 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 px-1" style={{ color: labelColor }}>
              {projectLabel}
            </p>
            <div className="flex flex-1 gap-3 min-h-0">
              <MiniChart title="Category"     data={category} />
              <MiniChart title="Sub-category" data={subcategory} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
