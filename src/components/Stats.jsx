import Card from "./Card"
import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

function transparentize (value, opacity) {
  const rgb = [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16),
  ]
  return `rgba(${rgb.join(",")}, ${opacity})`
}

export default function Stats ({ words, setPath }) {

  const percents = words.map(w => w.reviews ? w.correct / w.reviews * 100 : 0)
  const wordsNotLearned = percents.filter(w => w < 20).length
  const wordsLowLearned = percents.filter(w => w >= 20 && w < 40).length
  const wordsMidLearned = percents.filter(w => w >= 40 && w < 60).length
  const wordsWellLearned = percents.filter(w => w >= 60 && w < 90).length
  const wordsPerfectLearned = percents.filter(w => w >= 90).length

  const data = {
    labels: ['No Aprendidas', 'Aprendizaje Bajo', 'Aprendizaje Medio', 'Aprendizaje Alto', 'Dominadas'],
    datasets: [
      {
        data: [wordsNotLearned, wordsLowLearned, wordsMidLearned, wordsWellLearned, wordsPerfectLearned],
        backgroundColor: [
          transparentize('#2323ba', 0.5),
          transparentize('#c4350a', 0.5),
          transparentize('#c4be0a', 0.5),
          transparentize('#43a33b', 0.5),
          transparentize('#04bd35', 0.5),
        ],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'none',
      },
    },
  }

  return (
    <Card backPath='menu' setPath={setPath}>
      <h3 className="font-semibold mb-2">Estadísticas</h3>
      <div className="text-sm text-slate-700">
        <div className="w-full h-64 flex justify-center my-12">
          <PolarArea data={data} options={options} />
        </div>
        <div>Palabras totales: <strong>{words.length}</strong></div>
        <div>Última sincronización: <strong>{new Date().toLocaleString()}</strong></div>
      </div>
    </Card>
  )
}