import { createFileRoute } from '@tanstack/react-router'
import BuffaloMapView from '../../components/buffalo/MapView'
import BuffaloChartStrip from '../../components/buffalo/ChartStrip'

function BuffaloDashboard() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <BuffaloMapView />
      </div>
      <BuffaloChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/buffalo/')({
  component: BuffaloDashboard,
})
