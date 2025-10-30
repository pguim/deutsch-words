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
import { useRef } from 'react'
import { Loading } from './components/Loading'

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

  const prevUserId = useRef(null)

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return

    if (prevUserId.current === userId) return
    prevUserId.current = userId
    fetchWords()
  }, [session])

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

  if (loading) return <Loading />

  if (!session) {
    return (
      <>
        <Header session={session} handleSignOut={handleSignOut} setPath={setPath} />
        <LoginForm handleSignIn={handleSignIn} email={email} setEmail={setEmail} setPassword={setPassword} sessionError={sessionError} />
      </>
    )
  }

  const switchPanels = (path) => {
    switch (path) {
      case 'stats':
        return <Stats words={words} setPath={setPath} supabase={supabase} session={session} />
      case 'review':
        return <ReviewPanel words={words} onUpdate={() => fetchWords()} fetching={fetchingWords} supabase={supabase} setPath={setPath} session={session} />
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
    <main className='h-lvh w-lvw overflow-hidden'>
      <Header session={session} handleSignOut={handleSignOut} setPath={setPath} />
      {switchPanels(path)}
    </main>
  )
}




