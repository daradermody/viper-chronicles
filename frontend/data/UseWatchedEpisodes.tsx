

import { useCallback, useEffect, useState } from 'react'

export function useWatchedEpisodes() {
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    void fetchWatchedEpisodes()
  }, [setWatchedEpisodes, setLoading, setError])

  const fetchWatchedEpisodes = useCallback(async () => {
    try {
      const res = await fetch('/api/watchedEpisodes')
      setWatchedEpisodes(await res.json())
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [setWatchedEpisodes, setError, setLoading])

  async function setWatched(archiveOrgId: string, watched: boolean) {
    try {
      setWatchedEpisodes(prev => watched ? [...(prev || []), archiveOrgId] : (prev || []).filter(id => id !== archiveOrgId))
      await fetch(`/api/watchedEpisodes`, {
        method: 'POST',
        body: JSON.stringify({ archiveOrgId, watched }),
        headers: { 'Content-Type': 'application/json' },
      })
      await fetchWatchedEpisodes()
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return { watchedEpisodes, loading, error, setWatched }
}
