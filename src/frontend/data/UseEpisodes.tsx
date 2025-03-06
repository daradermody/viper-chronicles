import { useEffect, useState } from 'react'
import { Episode } from '../../episodes'

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    fetch('/api/episodes')
      .then(async response => setEpisodes(await response.json()))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [setEpisodes, setLoading, setError])

  return { episodes, loading, error }
}
