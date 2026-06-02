import { useAkwaabaLeaseAreas } from '../../api/akwaaba'
import LeaseAreaChartStrip from '../shared/LeaseAreaChartStrip'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'

export default function AkwaabaLeaseAreaChartStrip() {
  const { data } = useAkwaabaLeaseAreas()
  return (
    <LeaseAreaChartStrip
      projectLabel="Akwaaba"
      labelColor="#7ab060"
      data={data as unknown as GeoJSONFeatureCollection | undefined}
    />
  )
}
