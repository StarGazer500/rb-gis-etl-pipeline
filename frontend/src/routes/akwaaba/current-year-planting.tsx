import { createFileRoute } from '@tanstack/react-router'
import AkwaabaCurrentYearView from '../../components/akwaaba/CurrentYearView'
import AkwaabaCurrentYearChartStrip from '../../components/akwaaba/CurrentYearChartStrip'

function AkwaabaCurrentYearPlanting() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <AkwaabaCurrentYearView />
      </div>
      <AkwaabaCurrentYearChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/akwaaba/current-year-planting')({
  component: AkwaabaCurrentYearPlanting,
})
