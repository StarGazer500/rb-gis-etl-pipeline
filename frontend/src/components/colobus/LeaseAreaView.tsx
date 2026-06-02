import { useColobusLeaseAreas } from '../../api/colobus'
import LeaseAreaView from '../shared/LeaseAreaView'
import type { GeoJSONFeatureCollection } from '../shared/MapPanel'

export default function ColobusLeaseAreaView() {
  const { data, isLoading, isError } = useColobusLeaseAreas()
  return (
    <LeaseAreaView
      title="Leased Area Stratification"
      dotColor="#e87a4a"
      data={data as unknown as GeoJSONFeatureCollection | undefined}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
