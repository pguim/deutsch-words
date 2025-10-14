import Card from "./Card"
import { useEffect } from "react"

export default function ReviewPanelAnswer ({ setPath, question, answer, currentAnswer, answerValid, getNext }) {

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        getNext()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    getNext()
  }

  return (
    <Card backPath='menu' setPath={setPath}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 items-center min-w-80"
      >
        <div className="mb-3 text-center">
          <div className="text-2xl font-bold mt-2">{question}</div>
        </div>

        <>
          <div className="text-lg text-slate-700">{answer}</div>
          <div className="text-lg text-slate-700 flex flex-row">{answerValid ? '✅' : '❌'}{currentAnswer}</div>
          <button
            onClick={onSubmit}
            className={`px-3 py-1 bg-blue-500 hover:bg-blue-600" text-white rounded`}
          >
            Siguiente
          </button>
        </>
      </form>
    </Card >
  )
}