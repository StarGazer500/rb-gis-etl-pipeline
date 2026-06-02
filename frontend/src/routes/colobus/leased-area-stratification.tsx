import { createFileRoute } from '@tanstack/react-router'
import ColobusLeaseAreaView from '../../components/colobus/LeaseAreaView'
import ColobusLeaseAreaChartStrip from '../../components/colobus/LeaseAreaChartStrip'

function ColobusLeasedAreaStratification() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <ColobusLeaseAreaView />
      </div>
      <ColobusLeaseAreaChartStrip />
    </div>
  )
}

export const Route = createFileRoute('/colobus/leased-area-stratification')({
  component: ColobusLeasedAreaStratification,
})
