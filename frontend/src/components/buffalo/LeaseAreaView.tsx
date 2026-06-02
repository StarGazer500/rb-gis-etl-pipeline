import { useBuffaloLeaseAreas } from '../../api/buffalo'
import LeaseAreaView from '../shared/LeaseAreaView'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'

export default function BuffaloLeaseAreaView() {
  const { data, isLoading, isError } = useBuffaloLeaseAreas()
  return (
    <LeaseAreaView
      title="Leased Area Stratification"
      dotColor="#7ab060"
      data={data as unknown as GeoJSONFeatureCollection | undefined}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
