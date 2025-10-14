import { useState, useEffect, useRef } from "react"
import ReviewPanelResults from "./ReviewPanelResults"
import ReviewPanelAnswer from "./ReviewPanelAnswer"
import ReviewPanelQuestion from "./ReviewPanelQuestion"
import Card from "./Card"

export default function ReviewPanel ({ words, fetching, supabase, setPath }) {
  const [sessionWords, setSessionWords] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerValid, setAnswerValid] = useState(false)
  const inputRef = useRef(null)

  function computePriority (word) {
    const wrong = word.wrong || 0
    const correct = word.correct || 0
    const now = new Date()
    const last = word.last_review ? new Date(word.last_review) : null
    const daysSince = last ? Math.max(0, Math.floor((now - last) / (1000 * 60 * 60 * 24))) : 365
    return (wrong - correct) + daysSince / 3
  }

  // construir sesión
  useEffect(() => {
    const arr = [...words]
    arr.forEach(w => { w._priority = computePriority(w) })
    arr.sort((a, b) => b._priority - a._priority)
    setSessionWords(arr.slice(0, 10))
    setIndex(0)
    setShowAnswer(false)
  }, [words])

  // 🔹 foco automático fiable
  useEffect(() => {
    // esperar a que el DOM monte el input
    const timer = setTimeout(() => {
      if (!showAnswer && inputRef.current) {
        inputRef.current.focus()
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [index, showAnswer])

  async function checkAnswer () {
    if (!sessionWords[index]) return
    const w = sessionWords[index]
    console.log(currentAnswer)

    console.log(currentAnswer.toLowerCase())
    console.log(w.spanish.toLowerCase())
    const correct = currentAnswer.toLowerCase() === w.spanish.toLowerCase()
    setAnswerValid(correct)
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
    console.log('next')
    setShowAnswer(false)
    setCurrentAnswer('')
    setAnswerValid(false)
    setIndex(i => i + 1)
  }

  if (fetching) return <div>Loading...</div>
  if (!sessionWords.length) return (
    <Card backPath='menu' setPath={setPath}>No existen palabras. ¡Añade palabras para poder revisarlas!</Card>
  )

  const cur = sessionWords[index]

  return (
    <>
      {index >= sessionWords.length ? (
        <ReviewPanelResults setPath={setPath} />
      ) : (
        <>
          {showAnswer ? (
            <ReviewPanelAnswer setPath={setPath}
              question={cur.german}
              answer={cur.spanish}
              currentAnswer={currentAnswer}
              answerValid={answerValid}
              getNext={getNext}
            />
          ) : (
            <ReviewPanelQuestion
              setPath={setPath}
              question={cur.german}
              currentAnswer={currentAnswer}
              setCurrentAnswer={setCurrentAnswer}
              checkAnswer={checkAnswer}
              sessionWords={sessionWords}
              index={index}
            />
          )}
        </>
      )}
    </>
  )
}
