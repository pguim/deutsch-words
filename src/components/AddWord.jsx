import Card from "./Card";
import { useState } from "react";

export default function AddWord ({ supabase, fetchWords, session, setPath }) {
  return (
    <Card backPath='words' setPath={setPath}>
      <h2 className="text-lg font-semibold mb-3">Añadir Palabra</h2>
      <AddWordForm supabase={supabase} onAdded={() => {
        fetchWords()
        setPath('words')
      }}
        userId={session.user.id} />
    </Card>
  )
}

function AddWordForm ({ onAdded, userId, supabase }) {
  const [german, setGerman] = useState('')
  const [spanish, setSpanish] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit (e) {
    e.preventDefault()
    if (!german.trim() || !spanish.trim()) return
    setSaving(true)
    const { error } = await supabase.from('words').insert([{
      user_id: userId,
      german: german.trim(),
      spanish: spanish.trim(),
      last_review: null,
      reviews: 0,
      correct: 0,
      wrong: 0,
    }])
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
        <button className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded" disabled={saving}>Añadir</button>
        <button type="button" className="cursor-pointer px-4 py-2 bg-slate-200 rounded" onClick={() => { setGerman(''); setSpanish('') }}>Borrar</button>
      </div>
    </form>
  )
}