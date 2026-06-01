import { useColobusSubcompartments } from '../../api/colobus'
import CurrentYearView from '../shared/CurrentYearView'

export default function ColobusCurrentYearView() {
  const { data, isLoading, isError } = useColobusSubcompartments()
  return (
    <CurrentYearView
      title="Current Year Planting"
      dotColor="#e87a4a"
      data={data}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
