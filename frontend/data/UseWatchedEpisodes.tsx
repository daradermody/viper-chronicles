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
      const savedWatchedEpisodes = localStorage.getItem(`watched_${show}`)
      if (savedWatchedEpisodes) {
        setWatchedEpisodes(JSON.parse(savedWatchedEpisodes))
      }
      const res = await fetch(`/api/${show}/watchedEpisodes`)
      const responseData = await res.json()
      setWatchedEpisodes(responseData)
      localStorage.setItem(`watched_${show}`, JSON.stringify(responseData))
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [setWatchedEpisodes, setError, setLoading])

  async function setWatched(id: string, watched: boolean) {
    try {
      localStorage.removeItem(`watched_${show}`)
      setWatchedEpisodes(prevIds => watched ? [...(prevIds || []), id] : (prevIds || []).filter(prevId => prevId !== id))
      const response = await fetch(`/api/${show}/watchedEpisodes`, {
        method: 'POST',
        body: JSON.stringify({ id, watched }),
        headers: {
          'Content-Type': 'application/json',
          'X-Password': localStorage.getItem('login_password') || ''
        },
      })
      if (!response.ok) {
        await fetchWatchedEpisodes()
      }
    } catch (error) {
      setError(error as Error)
      await fetchWatchedEpisodes()
    } finally {
      setLoading(false)
    }
  }

  return { watchedEpisodes, loading, error, setWatched }
}
