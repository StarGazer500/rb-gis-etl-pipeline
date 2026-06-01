import { createFileRoute } from '@tanstack/react-router'
import BuffaloCurrentYearView from '../../components/buffalo/CurrentYearView'
import BuffaloCurrentYearChartStrip from '../../components/buffalo/CurrentYearChartStrip'

function BuffaloCurrentYearPlanting() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <BuffaloCurrentYearView />
      </div>
      <BuffaloCurrentYearChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/buffalo/current-year-planting')({
  component: BuffaloCurrentYearPlanting,
})
