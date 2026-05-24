import MapPanel from './MapPanel'
import type { Layer } from './MapPanel'

const LAYERS: Layer[] = [
  { id: 'boundaries', label: 'Boundaries', color: '#e87a4a', visible: true },
  { id: 'plots',      label: 'Plots',      color: '#c8e04a', visible: true },
  { id: 'firebreaks', label: 'Firebreaks', color: '#e04a4a', visible: false },
]

interface Phase2Props {
  collapsed: boolean
  onCollapse: () => void
  bothVisible?: boolean
}

export default function Phase2({ collapsed, onCollapse, bothVisible }: Phase2Props) {
  return (
    <MapPanel
      title="Phase 2"
      dotColor="#e87a4a"
      initialLayers={LAYERS}
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapseDirection="right"
      bothVisible={bothVisible}
    />
  )
}
