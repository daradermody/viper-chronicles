import { useCallback, useEffect, useState } from 'react'

export function useWatchedEpisodes(show: 'computerChronicles' | 'netCafe') {
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    void fetchWatchedEpisodes()
  }, [setWatchedEpisodes, setLoading, setError])

  const fetchWatchedEpisodes = useCallback(async () => {
    try {
      const res = await fetch(`/api/${show}/watchedEpisodes`)
      setWatchedEpisodes(await res.json())
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [setWatchedEpisodes, setError, setLoading])

  async function setWatched(id: string, watched: boolean) {
    try {
      setWatchedEpisodes(prevIds => watched ? [...(prevIds || []), id] : (prevIds || []).filter(prevId => prevId !== id))
      await fetch(`/api/${show}/watchedEpisodes`, {
        method: 'POST',
        body: JSON.stringify({ id, watched }),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      setError(error as Error)
      await fetchWatchedEpisodes()
    } finally {
      setLoading(false)
    }
  }

  return { watchedEpisodes, loading, error, setWatched }
}
