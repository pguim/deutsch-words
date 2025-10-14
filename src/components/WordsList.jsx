import { useState } from "react"
import Card from "./Card"
import IconEdit from "./Icons/IconEdit"
import IconTrash from "./Icons/IconTrash"
import IconX from "./Icons/IconX"

export default function WordsList ({ fetchingWords, words, setPath, setWord, supabase, fetchWords }) {

  const [filter, setFilter] = useState('')

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

  return (
    <Card backPath='menu' setPath={setPath}>
      <div className="flex flex-row">
        <h3 className="font-semibold mb-2 w-full">Palabras</h3>
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
      {fetchingWords ? <div>Cargando...</div> : (

        <table className="w-full text-sm table-auto  bg-blue-500 mt-0  min-w-lvh">
          <thead className="bg-blue-500 h-8">
            <tr className="text-left text-slate-100">
              <th><p className="mx-3 my-2">Alemán</p></th>
              <th><p className="mx-3 my-2">Castellano</p></th>
              <th><p className="mx-3 my-2">Revisiones</p></th>
              <th><p className="mx-3 my-2">Correctas</p></th>
              <th><p className="mx-3 my-2">Falladas</p></th>
              <th><p className="mx-3 my-2">Última revisión</p></th>
              <th><p className="mx-3 my-2"></p></th>
              <th><p className="mx-3 my-2"></p></th>
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              w.german.includes(filter) || w.spanish.includes(filter) ? (
                <tr key={w.id} className={((i % 2 == 0) ? "bg-white" : "bg-blue-50")}>
                  <td><p className="mx-3 my-2">{w.german}</p></td>
                  <td><p className="mx-3 my-2">{w.spanish}</p></td>
                  <td><p className="mx-3 my-2">{w.reviews}</p></td>
                  <td><p className="mx-3 my-2">{w.correct}</p></td>
                  <td><p className="mx-3 my-2">{w.wrong}</p></td>
                  <td><p className="mx-3 my-2">{w.last_review ? new Date(w.last_review).toLocaleString() : '-'}</p></td>
                  <td><button className="cursor-pointer mx-2" onClick={() => handleEdit(w)}><IconEdit className="stroke-blue-500 w-6" /></button></td>
                  <td><button className="cursor-pointer mx-2" onClick={() => { handleDelete(w) }}><IconTrash className="stroke-red-500 w-6" /></button></td>
                </tr>
              ) : ''
            ))}
          </tbody>
        </table>

      )
      }
    </Card >
  )
}