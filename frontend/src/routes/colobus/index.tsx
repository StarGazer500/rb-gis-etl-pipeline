import { createFileRoute } from '@tanstack/react-router'
import ColobusMapView from '../../components/colobus/MapView'
import ColobusChartStrip from '../../components/colobus/ChartStrip'

function ColobusDashboard() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <ColobusMapView />
      </div>
      <ColobusChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/colobus/')({
  component: ColobusDashboard,
})
