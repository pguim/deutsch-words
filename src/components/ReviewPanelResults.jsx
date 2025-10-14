import Card from "./Card"
import { useEffect } from "react"

export default function ReviewPanelResults ({ setPath }) {

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

  const onSubmit = (e) => {
    e.preventDefault()
    setPath('menu')
  }

  return (
    <Card backPath='menu' setPath={setPath}>
      <form onSubmit={onSubmit}
        className="p-4 rounded text-center"
      >
        <div className="font-semibold mb-2">¡Revisión completada! 🎉</div>
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