import Card from "./Card"
import { useEffect } from "react"

export default function ReviewPanelResults ({ setPath, correctAnswers, incorrectAnswers, supabase, session }) {

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        setPath('menu')
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
    e.preventDefault()
    updateReview()
    setPath('menu')
  }

  return (
    <Card backPath='menu' setPath={setPath}>
      <form onSubmit={onSubmit}
        className="p-4 rounded text-center"
      >
        <div className="font-semibold mb-3">¡Revisión completada! 🎉</div>
        <div className="mb-6">Has acertado {correctAnswers} de {correctAnswers + incorrectAnswers}</div>
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