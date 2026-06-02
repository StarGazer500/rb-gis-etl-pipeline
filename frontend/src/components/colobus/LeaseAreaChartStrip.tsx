import { useColobusLeaseAreas } from '../../api/colobus'
import LeaseAreaChartStrip from '../shared/LeaseAreaChartStrip'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'

export default function ColobusLeaseAreaChartStrip() {
  const { data } = useColobusLeaseAreas()
  return (
    <LeaseAreaChartStrip
      projectLabel="Colobus Reserve"
      labelColor="#e87a4a"
      data={data as unknown as GeoJSONFeatureCollection | undefined}
    />
  )
}
