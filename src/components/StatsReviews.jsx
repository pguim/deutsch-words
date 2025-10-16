import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import Card from './Card'
import { useState } from 'react'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function StatsReviews ({ reviews }) {

  const [timeRange, setTimeRange] = useState(0)
  const [reviewsData, setReviewsData] = useState([5, 1, 8, 4, 3, 6, 9])
  const [reviewsLabels, setReviewsLabels] = useState(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'])

  const data = {
    labels: reviewsLabels,
    datasets: [
      {
        label: 'Revisiones',
        data: reviewsData,
        fill: false,
        borderColor: 'rgba(34, 197, 94, .8)',
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        tension: .4,
        pointBackgroundColor: 'rgba(34, 197, 94, .4)',
        pointStyle: 'rectRounded',
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  }

  return (
    <Card noCenter={true}>
      <h3 className="font-semibold mb-2">Revisiones</h3>
      <div className="text-sm text-slate-700">
        <div className="w-full h-64 flex justify-center my-12">
          <Line data={data} options={options} />
        </div>
      </div>
      <div className="relative bg-gray-100 border-slate-300 border-1 rounded-lg p-1 flex justify-between w-full">
        <div
          className={`absolute top-1 bottom-1 w-1/3 bg-blue-500 opacity-90 rounded-md transition-all duration-300`}
          style={{
            width: "calc((100% - 0.5rem * 2) / 3)", // restamos el padding horizontal (2 × 0.25rem × 2)
            left: `calc(${timeRange * 100 / 3}% + ${timeRange * 1 / 3}rem)` // ajustamos la posición
          }}
        ></div>

        {["Semana", "Mes", "Año"].map((label, i) => (
          <button
            key={i}
            onClick={() => setTimeRange(i)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 font-medium transition-colors duration-300 ${timeRange === i ? "text-white" : "text-gray-600"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </Card>
  )

}