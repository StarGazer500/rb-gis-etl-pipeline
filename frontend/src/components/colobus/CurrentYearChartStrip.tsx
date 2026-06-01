import { useColobusSubcompartments } from '../../api/colobus'
import CurrentYearChartStrip from '../shared/CurrentYearChartStrip'

export default function ColobusCurrentYearChartStrip() {
  const { data } = useColobusSubcompartments()
  return <CurrentYearChartStrip projectLabel="Colobus Reserve" labelColor="#e87a4a" data={data} />
}
