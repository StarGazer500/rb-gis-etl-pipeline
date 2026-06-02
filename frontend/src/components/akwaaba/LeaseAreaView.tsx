import { useAkwaabaLeaseAreas } from '../../api/akwaaba'
import LeaseAreaView from '../shared/LeaseAreaView'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'

export default function AkwaabaLeaseAreaView() {
  const { data, isLoading, isError } = useAkwaabaLeaseAreas()
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
