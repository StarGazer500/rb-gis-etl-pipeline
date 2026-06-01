import { useSubcompartments } from '../../api/akwaaba'
import CurrentYearChartStrip from '../shared/CurrentYearChartStrip'

export default function AkwaabaCurrentYearChartStrip() {
  const { data } = useSubcompartments()
  return <CurrentYearChartStrip projectLabel="Akwaaba" labelColor="#7ab060" data={data} />
}
