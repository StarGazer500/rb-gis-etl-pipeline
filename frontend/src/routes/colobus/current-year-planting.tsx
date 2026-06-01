import { createFileRoute } from '@tanstack/react-router'
import ColobusCurrentYearView from '../../components/colobus/CurrentYearView'
import ColobusCurrentYearChartStrip from '../../components/colobus/CurrentYearChartStrip'

function ColobusCurrentYearPlanting() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <ColobusCurrentYearView />
      </div>
      <ColobusCurrentYearChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/colobus/current-year-planting')({
  component: ColobusCurrentYearPlanting,
})
