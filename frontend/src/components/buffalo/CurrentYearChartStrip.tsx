import { useBuffaloSubcompartments } from '../../api/buffalo'
import CurrentYearChartStrip from '../shared/CurrentYearChartStrip'

export default function BuffaloCurrentYearChartStrip() {
  const { data } = useBuffaloSubcompartments()
  return <CurrentYearChartStrip projectLabel="Buffalo Reserve" labelColor="#7ab060" data={data} />
}
