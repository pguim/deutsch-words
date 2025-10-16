import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { transparentize } from '../utils/common'
import Card from './Card'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default function StatsWords ({ words }) {
  const percents = words.map(w => w.reviews ? w.correct / w.reviews * 100 : 0)
  const wordsNotLearned = percents.filter(w => w < 20).length
  const wordsLowLearned = percents.filter(w => w >= 20 && w < 40).length
  const wordsMidLearned = percents.filter(w => w >= 40 && w < 60).length
  const wordsWellLearned = percents.filter(w => w >= 60 && w < 90).length
  const wordsPerfectLearned = percents.filter(w => w >= 90).length

  const wordsData = [wordsNotLearned, wordsLowLearned, wordsMidLearned, wordsWellLearned, wordsPerfectLearned]
  const data = {
    labels: ['No Aprendidas', 'Aprendizaje Bajo', 'Aprendizaje Medio', 'Aprendizaje Alto', 'Dominadas'],
    datasets: [
      {
        data: wordsData,
        backgroundColor: [
          transparentize('#2323ba', 0.6),
          transparentize('#c4350a', 0.6),
          transparentize('#c4be0a', 0.6),
          transparentize('#43a33b', 0.6),
          transparentize('#04bd35', 0.6),
        ],
        borderWidth: 1,
      },
    ],
  }
  const maxWordCategory = Math.max(...wordsData) + 1
  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: maxWordCategory,
      }
    },
    plugins: {
      legend: {
        position: 'none',
      },
    },
  }

  return (
    <Card noCenter={true}>
      <h3 className="font-semibold mb-2">Palabras</h3>
      <div className="text-sm text-slate-700">
        <div className="w-full h-64 flex justify-center my-12">
          <PolarArea data={data} options={options} />
        </div>
        <div>Palabras totales: <strong>{words.length}</strong></div>
      </div>
    </Card>
  )

}