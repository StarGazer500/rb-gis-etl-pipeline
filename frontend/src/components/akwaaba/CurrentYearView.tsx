import { useSubcompartments } from '../../api/akwaaba'
import CurrentYearView from '../shared/CurrentYearView'

export default function AkwaabaCurrentYearView() {
  const { data, isLoading, isError } = useSubcompartments()
  return (
    <CurrentYearView
      title="Current Year Planting"
      dotColor="#7ab060"
      data={data}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
