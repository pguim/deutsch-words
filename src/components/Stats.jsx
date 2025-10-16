import Card from "./Card"

import Center from "./Center"
import { useState } from "react"
import { useEffect } from "react"
import { Loading } from "./Loading"
import StatsWords from "./StatsWords"
import StatsReviews from "./StatsReviews"

export default function Stats ({ words, setPath, supabase, session }) {

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchReviews () {
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', session.user.id)
    if (error) {
      console.error('fetch reviews error', error)
    } else {
      setReviews(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  if (loading) return <Loading />

  console.log(reviews)

  return (
    <Center>
      <div className="flex flex-col gap-3">
        <Card backPath='menu' setPath={setPath} noCenter={true} inlineChildren={true}><h3 className="font-semibold self-center">Estadísticas</h3></Card>
        <div className="flex flex-row gap-3">
          <StatsWords words={words} />
          <StatsReviews words={words} />
        </div>
      </div>
    </Center>
  )
}