import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useSubcompartments, usePhase2 } from '../../api/akwaaba'

// ── Palette (matches Phase1 / Phase2) ────────────────────────────────────────
const PALETTE = [
  '#7ab060', '#e87a4a', '#e8c84a', '#4a90d9', '#e84aaa',
  '#4ad9c8', '#d94a4a', '#8fd98b', '#d98b4a', '#7a4ad9',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALUE_LABELS: Record<string, string> = {
  'not planted': 'Planned',
}
function displayLabel(v: string) {
  return VALUE_LABELS[v.toLowerCase()] ?? v
}

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
    .map(([raw, area], i) => ({
      name: displayLabel(raw),
      area: Math.round(area * 10) / 10,
      color: PALETTE[i % PALETTE.length],
    }))
}

// ── Single bar chart ──────────────────────────────────────────────────────────

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

// ── Divider ───────────────────────────────────────────────────────────────────

function PhaseDivider() {
  return <div className="w-px bg-[#2d5a18] shrink-0 mx-2" />
}

// ── Icons ─────────────────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

type PhaseView = 'both' | 'phase1' | 'phase2' | 'combined'

export default function ChartStrip({ phaseView }: { phaseView: PhaseView }) {
  const [open, setOpen] = useState(true)
  const { data: p1Data } = useSubcompartments()
  const { data: p2Data } = usePhase2()

  const p1Features = useMemo(
    () => (p1Data?.features ?? []).map((f) => ({ properties: f.properties as unknown as Record<string, unknown> })),
    [p1Data],
  )
  const p2Features = useMemo(
    () => (p2Data?.features ?? []).map((f) => ({ properties: f.properties as unknown as Record<string, unknown> })),
    [p2Data],
  )

  const p1PlantingStatus = useMemo(() => aggregateArea(p1Features, 'planting_status'), [p1Features])
  const p1Recipe         = useMemo(() => aggregateArea(p1Features, 'planting_type'),   [p1Features])
  const p1Year           = useMemo(() => aggregateArea(p1Features, 'year_planted'),    [p1Features])
  const p2Treatment      = useMemo(() => aggregateArea(p2Features, 'treatment_type'),  [p2Features])
  const p2Recipe         = useMemo(() => aggregateArea(p2Features, 'planting_type'),   [p2Features])

  return (
    <div className="shrink-0 bg-[#0d1f0a] border-t border-[#2d5a18]">
      {/* Header */}
      <div className="h-8 flex items-center justify-between px-4 border-b border-[#2d5a18]">
        <span className="text-[#a8c896] text-xs font-semibold uppercase tracking-wider">
          Analytics
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-[#a8c896] hover:text-white transition-colors"
          aria-label={open ? 'Hide charts' : 'Show charts'}
        >
          {open ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      {open && (
        <div className="h-52 flex px-3 py-2 gap-0">
          {/* ── Phase 1 ─── */}
          {phaseView !== 'phase2' && (
            <div className="flex flex-col flex-1 min-w-0 px-2">
              <p className="text-[#7ab060] text-[10px] font-bold uppercase tracking-widest mb-1.5 px-1">
                Phase 1
              </p>
              <div className="flex flex-1 gap-3 min-h-0">
                <MiniChart title="Planting Status" data={p1PlantingStatus} />
                <MiniChart title="Recipe"          data={p1Recipe} />
                <MiniChart title="Planting Year"   data={p1Year} />
              </div>
            </div>
          )}

          {(phaseView === 'both' || phaseView === 'combined') && <PhaseDivider />}

          {/* ── Phase 2 ─── */}
          {phaseView !== 'phase1' && (
            <div className="flex flex-col flex-1 min-w-0 px-2">
              <p className="text-[#e87a4a] text-[10px] font-bold uppercase tracking-widest mb-1.5 px-1">
                Phase 2
              </p>
              <div className="flex flex-1 gap-3 min-h-0">
                <MiniChart title="Treatment" data={p2Treatment} />
                <MiniChart title="Recipe"    data={p2Recipe} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
