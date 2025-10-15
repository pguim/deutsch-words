import Card from "./Card"
import { useEffect } from "react"
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement
} from 'chart.js'

ChartJS.register(ArcElement)

export default function ReviewPanelResults ({ setPath, correctAnswers, incorrectAnswers, supabase, session }) {

  const total = correctAnswers + incorrectAnswers

  const data = {
    labels: ['Aciertos', 'Errores'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['#22c55e', '#ef4444'],
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

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        onSubmit()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const updateReview = async () => {
    const { error } = await supabase.from('reviews').insert([{
      user_id: session.user.id,
      date: new Date().toISOString(),
      correct: correctAnswers,
      wrong: incorrectAnswers,
    }])
    if (error) console.error('error updating review', error)
  }

  const onSubmit = (e) => {
    e?.preventDefault()
    updateReview()
    setPath('menu')
  }

  return (
    <Card backPath='menu' setPath={setPath}>
      <form onSubmit={onSubmit}
        className="p-4 rounded text-center"
      >
        <div className="font-semibold mb-3">¡Revisión completada! 🎉</div>
        <div className='h-32 flex  justify-center w-full my-4'>
          <Doughnut data={data} options={options} />
        </div>

        <p className='text-slate-600 mb-4'>
          Has acertado <span className='font-semibold text-green-600'>{correctAnswers}</span> de{' '}
          <span className='font-semibold'>{total}</span> preguntas.
        </p>
        <button
          type="submit"
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Volver
        </button>
      </form>
    </Card >
  )
}