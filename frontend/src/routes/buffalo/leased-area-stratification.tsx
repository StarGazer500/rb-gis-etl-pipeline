import { createFileRoute } from '@tanstack/react-router'
import BuffaloLeaseAreaView from '../../components/buffalo/LeaseAreaView'
import BuffaloLeaseAreaChartStrip from '../../components/buffalo/LeaseAreaChartStrip'

function BuffaloLeasedAreaStratification() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <BuffaloLeaseAreaView />
      </div>
      <BuffaloLeaseAreaChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/buffalo/leased-area-stratification')({
  component: BuffaloLeasedAreaStratification,
})
