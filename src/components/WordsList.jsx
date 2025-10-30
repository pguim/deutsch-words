import { useState } from "react"
import Card from "./Card"
import IconEdit from "./Icons/IconEdit"
import IconTrash from "./Icons/IconTrash"
import IconX from "./Icons/IconX"
import { useEffect } from "react"
import ProgressBar from "./ProgressBar"
import { Loading } from "./Loading"

export default function WordsList ({ fetchingWords, words, setPath, setWord, supabase, fetchWords }) {

  useEffect(() => {
    fetchWords()
  }, [])

  const [filter, setFilter] = useState('')
  const [filteredWords, setFilterWords] = useState([])

  useEffect(() => {
    setFilterWords(words.filter(w =>
      w.german.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || w.spanish.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    ))
  }, [filter, words])

  const handleEdit = word => {
    setWord(word)
    setPath('words-edit')
  }

  async function handleDelete (word) {
    if (confirm(`¿Realmente desea eliminar la palabra \n ${word.german} - ${word.spanish}\n?`)) {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', word.id)

      if (error) {
        console.error(error)
      } else {
        fetchWords()
      }
    }
  }

  if (fetchingWords) return <Loading />

  return (


    <div className="mt-[80px] w-[80%] m-auto h-full">
      <div className="flex flex-row ">
        <h3 className="font-semibold mb-2 w-full">{`Palabras [${filteredWords.length}]`}</h3>
        <button className="px-3 bg-blue-500 text-white h-8 rounded cursor-pointer" onClick={() => { setPath('words-add') }}>Nueva...</button>
      </div>
      <div className="relative w-[50%] mb-2">
        <input
          placeholder="Filtrar..."
          className="pl-2 pr-8 py-1 border rounded w-full text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {filter &&
          <button
            type="button"
            onClick={() => setFilter('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 stroke-slate-400 hover:stroke-slate-800 "
          >
            <IconX className="w-5 h-5" />
          </button>
        }
      </div>
      {
        fetchingWords ? <div>Cargando...</div> : (
          <div className="h-[90%] overflow-y-scroll">
            <table className="w-full text-sm table-auto  bg-blue-500 mt-0 ">
              <thead className="bg-blue-500 h-8">
                <tr className="text-left text-slate-100">
                  <th><p className="mx-3 my-2">Alemán</p></th>
                  <th><p className="mx-3 my-2">Castellano</p></th>
                  <th><p className="mx-3 my-2 text-center">Revisiones</p></th>
                  <th><p className="mx-3 my-2 text-center">Correctas</p></th>
                  <th><p className="mx-3 my-2 text-center">Falladas</p></th>
                  <th><p className="mx-3 my-2 text-center">%</p></th>
                  <th><p className="mx-3 my-2">Última revisión</p></th>
                  <th><p className="mx-3 my-2"></p></th>
                  <th><p className="mx-3 my-2"></p></th>
                </tr>
              </thead>
              <tbody className="h-1/4 overflow-y-scroll">
                {filteredWords.map((w, i) => (
                  <tr key={w.id} className={((i % 2 == 0) ? "bg-white" : "bg-blue-50")}>
                    <td><p className="mx-3 my-2">{w.german}</p></td>
                    <td><p className="mx-3 my-2">{w.spanish}</p></td>
                    <td><p className="mx-3 my-2 text-center">{w.reviews}</p></td>
                    <td><p className="mx-3 my-2 text-center">{w.correct}</p></td>
                    <td><p className="mx-3 my-2 text-center">{w.wrong}</p></td>
                    <td>
                      <p className="mx-3 my-2 text-center">
                        <ProgressBar
                          value={w.reviews ? Number.parseFloat(w.correct / w.reviews * 100).toFixed(2) : Number.parseFloat(0).toFixed(2)}
                          width={80}
                          height={24}
                          showLabel={true}
                        />
                      </p>
                    </td>
                    <td><p className="mx-3 my-2">{w.last_review ? new Date(w.last_review).toLocaleString() : '-'}</p></td>
                    <td><button className="cursor-pointer mx-2" onClick={() => handleEdit(w)}><IconEdit className="stroke-blue-500 w-6" /></button></td>
                    <td><button className="cursor-pointer mx-2" onClick={() => { handleDelete(w) }}><IconTrash className="stroke-red-500 w-6" /></button></td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}