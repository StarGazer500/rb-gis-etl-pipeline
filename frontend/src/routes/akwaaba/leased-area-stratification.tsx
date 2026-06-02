import { createFileRoute } from '@tanstack/react-router'
import AkwaabaLeaseAreaView from '../../components/akwaaba/LeaseAreaView'
import AkwaabaLeaseAreaChartStrip from '../../components/akwaaba/LeaseAreaChartStrip'

function AkwaabaLeasedAreaStratification() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <AkwaabaLeaseAreaView />
      </div>
      <AkwaabaLeaseAreaChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/akwaaba/leased-area-stratification')({
  component: AkwaabaLeasedAreaStratification,
})
