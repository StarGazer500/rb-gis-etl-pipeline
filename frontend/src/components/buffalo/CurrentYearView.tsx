import { useBuffaloSubcompartments } from '../../api/buffalo'
import CurrentYearView from '../shared/CurrentYearView'

export default function BuffaloCurrentYearView() {
  const { data, isLoading, isError } = useBuffaloSubcompartments()
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
