import { useEffect } from "react";
import Card from "./Card";
import { useState } from "react";

export default function EditWord ({ supabase, fetchWords, session, setPath, word }) {
  return (
    <Card backPath='words' setPath={setPath}>
      <h2 className="text-lg font-semibold mb-3">Editar Palabra</h2>
      <EditWordForm supabase={supabase} onAdded={() => {
        fetchWords()
        setPath('words')
      }}
        userId={session.user.id} word={word} />
    </Card>
  )
}

function EditWordForm ({ onAdded, supabase, word }) {
  const [german, setGerman] = useState('')
  const [spanish, setSpanish] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setGerman(word.german)
    setSpanish(word.spanish)

  }, [])

  async function handleSubmit (e) {
    e.preventDefault()
    if (!german.trim() || !spanish.trim()) return
    setSaving(true)
    const { error } = await supabase
      .from('words')
      .update({
        german: german.trim(),
        spanish: spanish.trim()
      })
      .eq('id', word.id)

    if (error) {
      console.error(error)
    } else {
      setGerman('')
      setSpanish('')
      if (onAdded) onAdded()
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input className="w-full p-2 border rounded" placeholder="Alemán" value={german} onChange={e => setGerman(e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Castellano" value={spanish} onChange={e => setSpanish(e.target.value)} />
      <div className="flex gap-2">
        <button className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded" disabled={saving}>Actualizar</button>
        <button type="button" className="cursor-pointer px-4 py-2 bg-slate-200 rounded" onClick={() => { setGerman(''); setSpanish('') }}>Borrar</button>
      </div>
    </form>
  )
}