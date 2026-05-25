import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Phase1 from '../../components/map/Phase1'
import Phase2 from '../../components/map/Phase2'
import CombinedView from '../../components/map/CombinedView'
import ChartStrip from '../../components/map/ChartStrip'

type PhaseView = 'both' | 'phase1' | 'phase2' | 'combined'

function AkwaabaDashboard() {
  const [phaseView, setPhaseView] = useState<PhaseView>('both')

  const handlePhase1Collapse = () =>
    setPhaseView((v) => (v === 'both' ? 'phase2' : 'both'))

  const handlePhase2Collapse = () =>
    setPhaseView((v) => (v === 'both' ? 'phase1' : 'both'))

  const isCombined = phaseView === 'combined'

  return (
    <>
      <div className="h-10 bg-[#1e3d10] border-b border-[#2d5a18] flex items-center px-4 shrink-0 gap-3">
        <span className="text-[11px] font-semibold text-[#a8c896] uppercase tracking-wider select-none">View</span>
        <div className="flex items-center gap-0.5 bg-[#0d1f0a] rounded-lg p-0.5">
          {(
            [
              { value: 'both',     label: 'Both' },
              { value: 'phase1',   label: 'Phase 1 Only' },
              { value: 'phase2',   label: 'Phase 2 Only' },
              { value: 'combined', label: 'Combined' },
            ] as { value: PhaseView; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPhaseView(value)}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-150 ${
                phaseView === value
                  ? 'bg-[#2d5a18] text-white font-semibold'
                  : 'text-[#a8c896] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 flex overflow-hidden min-h-0">
          {isCombined ? (
            <CombinedView />
          ) : (
            <>
              <Phase1 collapsed={phaseView === 'phase2'} onCollapse={handlePhase1Collapse} bothVisible={phaseView === 'both'} />
              {phaseView === 'both' && <div className="w-1 bg-[#2d5a18] shrink-0" />}
              <Phase2 collapsed={phaseView === 'phase1'} onCollapse={handlePhase2Collapse} bothVisible={phaseView === 'both'} />
            </>
          )}
        </div>
        <ChartStrip phaseView={phaseView} />
      </div>
    </>
  )
}

export const Route = createFileRoute('/akwaaba/')({
  component: AkwaabaDashboard,
})
