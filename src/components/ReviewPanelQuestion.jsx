import { useEffect } from "react"
import Card from "./Card"
import { useRef } from "react"
import IconFlagGermany from "./Icons/IconFlagGermany"
import IconFlagSpain from "./Icons/IconFlagSpain"

export default function ReviewPanelQuestion ({ setPath, question, currentAnswer, setCurrentAnswer, checkAnswer, sessionWords, index, rev }) {
  const inputRef = useRef(null)
  const checkEnable = currentAnswer.length > 0
  const onSubmit = (e) => {
    e.preventDefault()
    checkAnswer()
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Card backPath='menu' setPath={setPath}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 items-center min-w-80"
        autoComplete="off"
      >
        <div className="mb-3 text-center flex">
          {rev ? <IconFlagSpain className="w-10 mr-2 mt-2" /> : <IconFlagGermany className="w-10 mr-2 mt-2" />}
          <div className="text-2xl font-bold mt-2">{question}</div>
        </div>

        <>
          <div className="flex flex-row">
            <input
              type="text"
              name="fake"
              style={{ display: "none" }}
              autoComplete="off"
            />
            {rev ? <IconFlagGermany className="w-10 mr-2" /> : <IconFlagSpain className="w-10 mr-2" />}
            <input
              ref={inputRef}
              type="text"
              id={`answer-${index}`}
              name={`answer-${index}`}
              placeholder="Respuesta..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="border rounded px-2 py-1"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
          <button
            type="submit"
            className={`px-3 py-1 ${checkEnable ? "bg-green-500 hover:bg-green-700" : "bg-green-200"} text-white rounded`}
            disabled={!checkEnable}
          >
            Comprobar
          </button>
        </>

        <div className="ml-auto text-sm text-slate-500">
          {index + 1} / {sessionWords.length}
        </div>
      </form>
    </Card >
  )
}