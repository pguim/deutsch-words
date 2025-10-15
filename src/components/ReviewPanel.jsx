import { useState, useEffect, useRef } from "react"
import ReviewPanelResults from "./ReviewPanelResults"
import ReviewPanelAnswer from "./ReviewPanelAnswer"
import ReviewPanelQuestion from "./ReviewPanelQuestion"
import Card from "./Card"
import { useCallback } from "react"

export default function ReviewPanel ({ words, fetching, supabase, setPath, session }) {
  const [sessionWords, setSessionWords] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerValid, setAnswerValid] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState({ question: '', answer: '', rev: false })
  const inputRef = useRef(null)

  const handleSetCurrentAnswer = useCallback(setCurrentAnswer, [setCurrentAnswer])

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

  useEffect(() => {
    if (sessionWords) defineQuestionMode()
  }, [sessionWords, index])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showAnswer && inputRef.current) {
        inputRef.current.focus()
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [index, showAnswer])

  const defineQuestionMode = () => {
    const v = Math.random()
    if (v > 0.5) {
      setCurrentQuestion({ question: sessionWords[index]?.german, answer: sessionWords[index]?.spanish, rev: false })
    } else {
      setCurrentQuestion({ question: sessionWords[index]?.spanish, answer: sessionWords[index]?.german, rev: true })
    }
  }

  async function checkAnswer () {
    if (!sessionWords[index]) return
    const w = sessionWords[index]


    let correct = false
    if (!currentQuestion.rev) {
      // given answer is one of the options
      currentQuestion.answer.split(',').forEach(a => {
        console.log(a)
        if (currentAnswer.toLowerCase() === a.toLowerCase().trimStart()) correct = true
      })
      // given answer are whole options
      if (currentAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) correct = true
    } else {
      correct = currentAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()
    }

    correct && setCorrectAnswers(v => v + 1)
    !correct && setIncorrectAnswers(v => v + 1)
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
    setShowAnswer(false)
    setCurrentAnswer('')
    setAnswerValid(false)
    setIndex(i => i + 1)
  }

  if (fetching) return <div>Loading...</div>
  if (!sessionWords.length) return (
    <Card backPath='menu' setPath={setPath}>No existen palabras. ¡Añade palabras para poder revisarlas!</Card>
  )

  return (
    <>
      {index >= sessionWords.length ? (
        <ReviewPanelResults setPath={setPath} correctAnswers={correctAnswers} incorrectAnswers={incorrectAnswers} supabase={supabase} session={session} />
      ) : (
        <>
          {showAnswer ? (
            <ReviewPanelAnswer setPath={setPath}
              question={currentQuestion.question}
              answer={currentQuestion.answer}
              currentAnswer={currentAnswer}
              answerValid={answerValid}
              getNext={getNext}
            />
          ) : (
            <ReviewPanelQuestion
              setPath={setPath}
              question={currentQuestion.question}
              rev={currentQuestion.rev}
              currentAnswer={currentAnswer}
              setCurrentAnswer={handleSetCurrentAnswer}
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
