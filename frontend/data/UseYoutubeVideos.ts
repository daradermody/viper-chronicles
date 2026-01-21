import {useCallback, useEffect, useState} from 'react'
import type {YoutubeVideo} from '../../api/youtube/videos'
import {useAuth} from '../AuthProvider'

export function useYoutubeVideos() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const {password} = useAuth()

  const refetchVideos = useCallback(async () => {
      const response = await fetch(`/api/youtube/videos`)
      setVideos(await response.json())
  },  [setVideos]);

  const addVideo = useCallback(async (id: string) => {
    const response = await fetch('/api/youtube/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': password || ''
      },
      body: JSON.stringify({ id })
    })
    if (response.ok) {
      await refetchVideos()
    } else {
      console.error('Failed to add video:', response.statusText)
    }
  }, [password, setVideos])

  const deleteVideo = useCallback(async (id: string) => {
    const response = await fetch('/api/youtube/videos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Password': password || ''
      },
      body: JSON.stringify({ id })
    })
    if (response.ok) {
      setVideos(prevVideos => prevVideos.filter(videoId => videoId.id !== id))
    } else {
      console.error('Failed to delete video:', response.statusText)
    }
  }, [password, setVideos])

  useEffect(() => {
    refetchVideos()
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [setVideos, setLoading, setError])

  return { videos, loading, error, addVideo, deleteVideo }
}

export function useYoutubeVideo(id: string) {
  const [video, setVideo] = useState<YoutubeVideo>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(`/api/youtube/videoInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch video info: ${response.statusText}`)
        }
        setVideo(await response.json())
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }
    void fetchVideo()
  }, [id, setVideo, setLoading, setError])

  return { video, loading, error }
}