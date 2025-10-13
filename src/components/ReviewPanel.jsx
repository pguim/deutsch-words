import { useState, useEffect } from "react"
import Card from "./Card"

export default function ReviewPanel ({ words, fetching, supabase, setPath }) {
  const [sessionWords, setSessionWords] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  // Utility: compute priority for a word object
  function computePriority (word) {
    // word: { correct, wrong, last_review }
    const wrong = word.wrong || 0
    const correct = word.correct || 0
    const now = new Date()
    const last = word.last_review ? new Date(word.last_review) : null
    const daysSince = last ? Math.max(0, Math.floor((now - last) / (1000 * 60 * 60 * 24))) : 365
    // Basic formula: more wrongs increases priority; older reviews increase priority
    return (wrong - correct) + daysSince / 3
  }

  // Build prioritized list when words change
  useEffect(() => {
    const arr = [...words]
    // compute priority and sort desc
    arr.forEach(w => { w._priority = computePriority(w) })
    arr.sort((a, b) => b._priority - a._priority)
    // take top 10 (or fewer if not enough)
    setSessionWords(arr.slice(0, 10))
    setIndex(0)
    setShowAnswer(false)
  }, [words])

  async function checkAnswer () {
    if (!sessionWords[index]) return
    const w = sessionWords[index]
    const correct = currentAnswer.toLowerCase() === w.spanish.toLowerCase()
    // optimistic update locally
    const updates = {
      reviews: (w.reviews || 0) + 1,
      correct: (w.correct || 0) + (correct ? 1 : 0),
      wrong: (w.wrong || 0) + (correct ? 0 : 1),
      last_review: new Date().toISOString(),
    }
    const { error } = await supabase.from('words').update(updates).eq('id', w.id)
    if (error) console.error('error updating review', error)
    setShowAnswer(true)
  }

  function getNext () {
    // move to next
    setShowAnswer(false)
    setCurrentAnswer('')
    setIndex(i => i + 1)
  }

  if (fetching) return <div>Loading...</div>
  if (!sessionWords.length) return <div>No words yet. Add some to start a review.</div>

  const cur = sessionWords[index]
  const checkEnable = currentAnswer.length > 1
  return (
    <Card backPath='menu' setPath={setPath}>
      <h2 className="text-lg font-semibold mb-3">Revisión</h2>
      {index >= sessionWords.length ? (
        <div className="p-4 border rounded text-center">
          <div className="font-semibold mb-2">Session complete 🎉</div>
          <button onClick={() => { setIndex(0); setShowAnswer(false) }} className="px-4 py-2 bg-blue-600 text-white rounded">Repeat session</button>
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <div className="text-2xl font-bold mt-2">{cur.german}</div>
          </div>

          {showAnswer ? (
            <div className="mb-4">
              <div className="text-lg text-slate-700">{cur.spanish}</div>
              <button className={"px-2 py-1 bg-blue-500 cursor-pointer  text-white rounded"} onClick={() => getNext()} >Siguiente</button>

            </div>
          ) :
            (<div className="flex flex-col gap-2">
              <input placeholder="Respuesta..." onChange={(e) => setCurrentAnswer(e.target.value)}></input>
              <button className={`px-2 py-1 ${checkEnable ? "bg-green-500 cursor-pointer" : "bg-green-300"} text-white rounded`} onClick={() => checkAnswer()} disabled={!checkEnable}>Comprobar</button>
              <div className="ml-auto text-sm text-slate-500">{index + 1} / {sessionWords.length}</div>
            </div>)}
        </div>
      )}
    </Card>
  )
}