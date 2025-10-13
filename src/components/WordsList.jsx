import Card from "./Card"

export default function WordsList ({ fetchingWords, words, setPath, setWord, supabase, fetchWords }) {

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
      <div className="flex flex-row pb-5">
        <h3 className="font-semibold mb-2 w-full pt-3">Palabras</h3>
        <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={() => { setPath('words-add') }}>Nueva...</button>
      </div>
      {fetchingWords ? <div>Cargando...</div> : (

        <table className="w-full text-sm table-auto  bg-blue-500 mt-0">
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
              <tr key={w.id} className={((i % 2 == 0) ? "bg-white" : "bg-blue-50")}>
                <td><p className="mx-3 my-2">{w.german}</p></td>
                <td><p className="mx-3 my-2">{w.spanish}</p></td>
                <td><p className="mx-3 my-2">{w.reviews}</p></td>
                <td><p className="mx-3 my-2">{w.correct}</p></td>
                <td><p className="mx-3 my-2">{w.wrong}</p></td>
                <td><p className="mx-3 my-2">{w.last_review ? new Date(w.last_review).toLocaleString() : '-'}</p></td>
                <td><button className="mx-3 my-1 py-1 px-2 bg-blue-500 text-white text-sm rounded cursor-pointer" onClick={() => handleEdit(w)}>Editar</button></td>
                <td><button className="mx-3 my-1 py-1 px-2 bg-red-500 text-white text-sm rounded cursor-pointer" onClick={() => { handleDelete(w) }}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>

      )
      }
    </Card >
  )
}