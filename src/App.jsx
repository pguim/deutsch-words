/*
Vocab SRS - Single-file React skeleton
Default export: App

WHAT THIS FILE IS: A complete single-file React app (JSX) that uses
Supabase (Auth + Postgres) to implement:
 - Supabase Auth (email/password)
 - Add word form (german/spanish)
 - Review session of 10 words prioritized by errors / time since last review
 - Stats update (reviews, correct, wrong, last_review)

HOW TO USE / SETUP (short):
1) Create a Supabase project and set env vars (on Vercel or locally):
   NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
2) Create the `words` table in Supabase SQL editor with this schema:

-- SQL (run in Supabase SQL editor)
-- Make sure you also add a `user_id` column (uuid) to associate rows with the authenticated user
create table if not exists public.words (
  id uuid default auth.uid_generate_v4() primary key,
  user_id uuid not null,
  german text not null,
  spanish text not null,
  last_review timestamptz,
  reviews int default 0,
  correct int default 0,
  wrong int default 0,
  created_at timestamptz default now()
);

-- Note: If you prefer an integer serial id, you can change `id` accordingly.

3) Enable Row Level Security (RLS) on the table and add a policy to only allow
   authenticated users to access their own rows. Example policy (in Policies tab):

-- Policy: "Users can manage their rows"
-- USING expression:
auth.role() = 'authenticated' AND user_id = auth.uid()
-- WITH CHECK expression:
user_id = auth.uid()

4) Install dependencies (if you're turning this into a full project):
   - react, react-dom
   - @supabase/supabase-js
   - tailwindcss (optional, used classes are Tailwind utilities)

Example (npm):
  npm init vite@latest my-app --template react
  cd my-app
  npm install @supabase/supabase-js
  # install tailwind per Tailwind docs

5) Environment variables for Vercel/Netlify: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

-----
NOTES about design decisions:
 - This single-file is meant to be a starting point. In a real project you would split components
   into separate files and manage environment variables with a build tool.
 - Authentication uses Supabase Auth signInWithPassword. The App requires a registered user.
 - Priority calculation is done client-side for simplicity. If you later want to offload to the DB,
   create an SQL view or stored procedure.

*/

import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Replace by env vars in your deployment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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

// Simple Tailwind-styled components inline
function Center ({ children }) {
  return <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">{children}</div>
}

function Card ({ children }) {
  return <div className="bg-white shadow rounded-lg p-6 w-full max-w-3xl">{children}</div>
}

export default function App () {
  const [session, setSession] = useState(null)
  const [sessionError, setSessionError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [words, setWords] = useState([])
  const [fetchingWords, setFetchingWords] = useState(false)

  // Auth listener
  useEffect(() => {
    setLoading(true)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
    // check current session
    const checkCurrentSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }
    checkCurrentSession()
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Load words for the current user
  useEffect(() => {
    if (!session?.user?.id) return
    fetchWords()
  }, [session])

  async function fetchWords () {
    setFetchingWords(true)
    const uid = session.user.id
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', uid)
    if (error) {
      console.error('fetch words error', error)
    } else {
      setWords(data || [])
    }
    setFetchingWords(false)
  }

  async function handleSignIn (e) {
    e.preventDefault()
    setLoading(true)
    const res = await supabase.auth.signInWithPassword({ email, password })
    if (res.error) {
      setSessionError(true)
    } else {
      setSessionError(false)
      setSession(res.data.session)
      setEmail('')
      setPassword('')
    }
    setLoading(false)
  }

  async function handleSignOut () {
    await supabase.auth.signOut()
    setSession(null)
    setWords([])
  }

  if (loading) return <Center><Card>Loading...</Card></Center>

  if (!session) {
    return (
      <Center>
        <Card>
          <h1 className="text-2xl font-semibold mb-4">Iniciar sessión</h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="Contraseña" type="password" autocomplet="current-password" value={password} onChange={e => setPassword(e.target.value)} />
            {sessionError ? <h2 className="text-ms font-semibold mb-2 text-red-400">¡Mail o usuario incorrectos! Revise la información y vuelva a intentarlo</h2> : ''}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Acceder</button>
              <button type="button" className="px-4 py-2 bg-slate-200 rounded" onClick={() => { setEmail(''); setPassword('') }}>Borrar</button>
            </div>
          </form>
        </Card>
      </Center>
    )
  }

  return (
    <>
      <div className="fixed w-screen bg-blue-100 p-5 px-10 mx-auto">
        <header className="  flex items-center justify-between">
          <h1 className="text-2xl font-bold">Deutsch Words</h1>
          <div className="flex items-center gap-3">
            <div className="text-m text-slate-500">{session.user.email.split('@')[0]}</div>
            <button onClick={handleSignOut} className="px-3 py-1 bg-red-500 text-white rounded">Sign out</button>
          </div>
        </header>
      </div>
      <Center>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-1">
            <Card>
              <h2 className="text-lg font-semibold mb-3">Add new word</h2>
              <AddWordForm onAdded={() => fetchWords()} userId={session.user.id} />
            </Card>

            <div className="mt-4">
              <Card>
                <h3 className="font-semibold mb-2">Stats</h3>
                <div className="text-sm text-slate-700">
                  <div>Total words: <strong>{words.length}</strong></div>
                  <div>Last sync: <strong>{new Date().toLocaleString()}</strong></div>
                </div>
              </Card>
            </div>
          </section>

          <section className="md:col-span-2">
            <Card>
              <h2 className="text-lg font-semibold mb-3">Review Session — Prioritized</h2>
              <ReviewPanel words={words} onUpdate={() => fetchWords()} fetching={fetchingWords} />
            </Card>

            <div className="mt-4">
              <Card>
                <h3 className="font-semibold mb-2">All words</h3>
                {fetchingWords ? <div>Loading...</div> : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left"><th>Alemán</th><th>Castellano</th><th>Revisiones</th><th>Correctas</th><th>Falladas</th><th>Última revisión</th></tr>
                    </thead>
                    <tbody>
                      {words.map(w => (
                        <tr key={w.id} className="border-t"><td>{w.german}</td><td>{w.spanish}</td><td>{w.reviews}</td><td>{w.correct}</td><td>{w.wrong}</td><td>{w.last_review ? new Date(w.last_review).toLocaleString() : '-'}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </div>
          </section>
        </main>

      </Center>
    </>
  )
}

function AddWordForm ({ onAdded, userId }) {
  const [german, setGerman] = useState('')
  const [spanish, setSpanish] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit (e) {
    e.preventDefault()
    if (!german.trim() || !spanish.trim()) return
    setSaving(true)
    const { data, error } = await supabase.from('words').insert([{
      user_id: userId,
      german: german.trim(),
      spanish: spanish.trim(),
      last_review: null,
      reviews: 0,
      correct: 0,
      wrong: 0,
    }])
    if (error) {
      alert('Error saving: ' + error.message)
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
      <input className="w-full p-2 border rounded" placeholder="German" value={german} onChange={e => setGerman(e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Spanish" value={spanish} onChange={e => setSpanish(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={saving}>Add</button>
        <button type="button" className="px-4 py-2 bg-slate-200 rounded" onClick={() => { setGerman(''); setSpanish('') }}>Clear</button>
      </div>
    </form>
  )
}

function ReviewPanel ({ words, onUpdate, fetching }) {
  const [sessionWords, setSessionWords] = useState([])
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [saving, setSaving] = useState(false)

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
    <div>
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
    </div>
  )
}
