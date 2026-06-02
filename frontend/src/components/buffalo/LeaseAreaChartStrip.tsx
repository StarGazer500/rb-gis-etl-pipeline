import { useBuffaloLeaseAreas } from '../../api/buffalo'
import LeaseAreaChartStrip from '../shared/LeaseAreaChartStrip'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'

export default function BuffaloLeaseAreaChartStrip() {
  const { data } = useBuffaloLeaseAreas()
  return (
    <LeaseAreaChartStrip
      projectLabel="Buffalo Reserve"
      labelColor="#7ab060"
      data={data as unknown as GeoJSONFeatureCollection | undefined}
    />
  )
}
