import { Episode } from '../types'
import { useEffect, useState } from 'react'
import { YouTubePlayer } from 'youtube-player/dist/types'
import YTPlayer from 'youtube-player'
import PlayerStates from 'youtube-player/dist/constants/PlayerStates'
import { IconButton, Typography } from '@mui/material'
import { Keyboard } from '@mui/icons-material'

export function VideoPlayer({ episode }: { episode: Episode }) {
  const [player, setPlayer] = useState<YouTubePlayer>()

  useEffect(() => {
    if (episode.youtubeId) {
      const player = YTPlayer('yt-player', { videoId: episode.youtubeId });
      setPlayer(player)
    }
  }, [episode])

  if (episode.youtubeId) {
    return (
      <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
        <div id="yt-player" style={{ maxWidth: '100%', width: '800px', height: '600px' }}/>
        {player && <YouTubeKeyControl player={player}/>}
      </div>
    )
  } else if (episode.archiveOrgId) {
    return (
      <div className="video-container video-spinner">
        <iframe
          src={`https://archive.org/embed/${episode.archiveOrgId}`}
          style={{ height: '100%', width: '100%', border: 0 }}
          allowFullScreen
          allow="encrypted-media;"
        />
      </div>
    )
  } else {
    return (
      <div
        className="video-container"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <i>Couldn't find the video on YouTube or Archive.org</i>
        <span style={{ fontSize: '4rem' }}>:(</span>
      </div>
    )
  }
}

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function YouTubeKeyControl({ player }: { player: YouTubePlayer }) {
  const [showYtControls, setShowYtControls] = useState(false)
  const [numberToTime, setNumberToTime] = useState<Record<string, number>>({})

  useEffect(() => {
    async function handleKeydown(e: KeyboardEvent) {
      console.log(e.code, e.target)
      if (numberToTime[e.key] !== undefined) {
        player?.seekTo(numberToTime[e.key], true)
        player?.playVideo()
      } else if ((e.target as any)?.tagName !== 'INPUT') {
        if (e.code === 'Space' || e.code === 'KeyK') {
          e.preventDefault()
          const state = await player?.getPlayerState()
          if (state === PlayerStates.PLAYING) {
            await player?.pauseVideo()
          } else {
            await player?.playVideo()
          }
        } else if (e.code === 'Comma') {
          e.preventDefault()
          player?.seekTo(await player.getCurrentTime() - (1 / 30), true)
        } else if (e.code === 'Period') {
          e.preventDefault()
          player?.seekTo(await player.getCurrentTime() + (1 / 30), true)
        }
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [player, numberToTime])

  return (
    <div className="hide-sm-down">
      <IconButton onClick={() => setShowYtControls(prev => !prev)}>
        <Keyboard/>
      </IconButton>
      {showYtControls && (
        <div style={{ maxWidth: '500px', marginLeft: '8px' }}>
          <Typography variant="subtitle2" style={{ marginBottom: '8px' }}>
            You can save video timestamps to your number keys and quickly jump around the video, for example when making a groovy song.
          </Typography>
          <Typography variant="subtitle2" style={{ marginBottom: '8px' }}>
            Choose a time in the video, then press one of the UI keys below. Once set, pressing that key on your physical keyboard jumps to that timestamp.
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="kbc-button kbc-button-xs">K</button>
            <span>Play/pause</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div>
              <button className="kbc-button kbc-button-xs">,</button>
              <button className="kbc-button kbc-button-xs">.</button>
            </div>
            <span>Step backward/forward</span>
          </div>

          {keys.map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="kbc-button kbc-button-xs"
                onClick={async () => {
                  const time = await player?.getCurrentTime()
                  if (time !== undefined) {
                    setNumberToTime(prev => ({ ...prev, [key]: time }))
                  }
                }}
              >
                {key}
              </button>
              {numberToTime[key] !== undefined ? toTimestamp(numberToTime[key]) : <i style={{ color: 'gray' }}>{'<not set>'}</i>}
            </div>
          ))}
          <Typography variant="subtitle2" style={{ marginTop: '8px', fontSize: '0.75rem' }}>
            Note: Because of the way YouTube captures mouse focus, you have to click outside the video for the keys to work.
          </Typography>
        </div>
      )}
    </div>
  )
}

function toTimestamp(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const remaining = totalSeconds % 3600
  const minutes = Math.floor(remaining / 60)
  const remainingSeconds = remaining % 60
  const seconds = Math.floor(remainingSeconds)
  const milliseconds = Math.floor(remainingSeconds % 1 * 1000)
  const minsSecs = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padEnd(3, '0')}`
  if (hours) {
    return `${hours.toString().padStart(2, '0')}:${minsSecs}`
  } else {
    return minsSecs
  }
}
