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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function StatsReviews ({ reviews }) {
  const reviewsData = [5, 1, 8, 4, 3, 6, 9]

  const data = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Revisiones',
        data: reviewsData,
        fill: false,
        borderColor: 'rgba(34, 197, 94, .8)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4, // 🔹 controla la suavidad (0 = recto, 1 = muy curvo)
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
    </Card>
  )

}