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
import Header from './components/Header'
import Card from './components/Card'
import AddWord from './components/AddWord'
import Center from './components/Center'
import LoginForm from './components/LoginForm'
import Stats from './components/Stats'
import ReviewPanel from './components/ReviewPanel'
import WordsList from './components/WordsList'
import MainMenu from './components/MainMenu'
import EditWord from './components/EditWord'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



export default function App () {
  const [session, setSession] = useState(null)
  const [sessionError, setSessionError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [words, setWords] = useState([])
  const [fetchingWords, setFetchingWords] = useState(false)
  const [path, setPath] = useState('menu')
  const [editWord, setEditWord] = useState({})

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
      <LoginForm handleSignIn={handleSignIn} email={email} setEmail={setEmail} setPassword={setPassword} sessionError={sessionError} />
    )
  }

  const switchPanels = (path) => {
    switch (path) {
      case 'stats':
        return <Stats words={words} setPath={setPath} />
      case 'review':
        return <ReviewPanel words={words} onUpdate={() => fetchWords()} fetching={fetchingWords} supabase={supabase} setPath={setPath} />
      case 'words':
        return <WordsList words={words} fetchingWords={fetchingWords} setPath={setPath} setWord={setEditWord} supabase={supabase} fetchWords={fetchWords} />
      case 'words-add':
        return <AddWord supabase={supabase} fetchWords={fetchWords} session={session} setPath={setPath} />
      case 'words-edit':
        return <EditWord supabase={supabase} fetchWords={fetchWords} session={session} setPath={setPath} word={editWord} />
      default:
        return <MainMenu setPath={setPath} />
    }
  }

  return (
    <>
      <Header session={session} handleSignOut={handleSignOut} setPath={setPath} />
      {switchPanels(path)}
    </>
  )
}




