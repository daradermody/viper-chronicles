import { useEffect, useState } from 'react'
import { Episode } from '../../types'

export function useEpisodes(show: 'computerChronicles' | 'netCafe') {
  const [episodes, setEpisodes] = useState<Episode[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    fetch(`/api/${show}/episodes`, { cache: 'default' })
      .then(async response => setEpisodes(await response.json()))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [setEpisodes, setLoading, setError])

  return { episodes, loading, error }
}
