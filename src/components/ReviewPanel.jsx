import { useState, useEffect } from "react"
import Card from "./Card"

export default function ReviewPanel ({ words, onUpdate, fetching, supabase, setPath }) {
  const [sessionWords, setSessionWords] = useState([])
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [saving, setSaving] = useState(false)

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

  async function mark (correct) {
    if (!sessionWords[index]) return
    setSaving(true)
    const w = sessionWords[index]
    // optimistic update locally
    const updates = {
      reviews: (w.reviews || 0) + 1,
      correct: (w.correct || 0) + (correct ? 1 : 0),
      wrong: (w.wrong || 0) + (correct ? 0 : 1),
      last_review: new Date().toISOString(),
    }
    const { error } = await supabase.from('words').update(updates).eq('id', w.id)
    if (error) console.error('error updating review', error)
    // move to next
    setShowAnswer(false)
    setIndex(i => i + 1)
    setSaving(false)
    if (onUpdate) onUpdate()
  }

  if (fetching) return <div>Loading...</div>
  if (!sessionWords.length) return <div>No words yet. Add some to start a review.</div>

  const cur = sessionWords[index]
  const remaining = sessionWords.length - index

  return (
    <Card backPath='menu' setPath={setPath}>
      <h2 className="text-lg font-semibold mb-3">Revisión</h2>
      <div className="mb-4 text-sm text-slate-600">Session words: {sessionWords.length} • Remaining: {remaining}</div>
      {index >= sessionWords.length ? (
        <div className="p-4 border rounded text-center">
          <div className="font-semibold mb-2">Session complete 🎉</div>
          <button onClick={() => { setIndex(0); setShowAnswer(false) }} className="px-4 py-2 bg-blue-600 text-white rounded">Repeat session</button>
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <div className="text-sm text-slate-500">Priority: {cur._priority.toFixed(2)}</div>
            <div className="text-2xl font-bold mt-2">{cur.german}</div>
          </div>

          {showAnswer ? (
            <div className="mb-4">
              <div className="text-lg text-slate-700">{cur.spanish}</div>
            </div>
          ) : null}

          <div className="flex gap-2">
            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)} className="px-4 py-2 bg-slate-200 rounded">Show answer</button>
            ) : (
              <>
                <button onClick={() => mark(true)} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">I knew it</button>
                <button onClick={() => mark(false)} disabled={saving} className="px-4 py-2 bg-red-500 text-white rounded">I missed it</button>
              </>
            )}
            <div className="ml-auto text-sm text-slate-500">{index + 1} / {sessionWords.length}</div>
          </div>
        </div>
      )}
    </Card>
  )
}