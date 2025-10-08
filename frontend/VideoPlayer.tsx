import { Episode } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { YouTubePlayer } from 'youtube-player/dist/types'
import YTPlayer from 'youtube-player'
import PlayerStates from 'youtube-player/dist/constants/PlayerStates'
import { IconButton, Popover, TextField, Tooltip, Typography } from '@mui/material'
import { Keyboard, Edit, Check } from '@mui/icons-material'

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

const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const letterKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']

interface Timestamp {
  time: number;
  name?: string;
}

function YouTubeKeyControl({ player }: { player: YouTubePlayer }) {
  const [showYtControls, setShowYtControls] = useState(false)
  const [keyToTime, setKeyToTime] = useState<Record<string, Timestamp>>({})

  useEffect(() => {
    async function handleKeydown(e: KeyboardEvent) {
      if ((e.target as any)?.tagName !== 'INPUT') {
        if (keyToTime[e.key]) {
          player?.seekTo(keyToTime[e.key].time, true)
          player?.playVideo()
        } if (e.code === 'Space' || e.code === 'KeyK') {
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
  }, [player, keyToTime])

  return (
    <div className="hide-sm-down">
      <IconButton onClick={() => setShowYtControls(prev => !prev)}>
        <Keyboard/>
      </IconButton>
      {showYtControls && (
        <div style={{ maxWidth: '600px', marginLeft: '8px' }}>
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

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '100%' }}>
              {numberKeys.map(key => (
                <TimeButton
                  key={key}
                  keyboardKey={key}
                  player={player!}
                  timestamp={keyToTime[key]}
                  onChange={time => setKeyToTime(prev => ({ ...prev, [key]: time }))}
                />
              ))}
            </div>
            <div style={{ width: '100%'}}>
              {letterKeys.map(key => (
                <TimeButton
                  key={key}
                  keyboardKey={key.toUpperCase()}
                  player={player!}
                  timestamp={keyToTime[key]}
                  onChange={time => {
                    setKeyToTime(prev => ({ ...prev, [key]: time }))
                  }}
                />
              ))}
            </div>
          </div>
          <Typography variant="subtitle2" style={{ marginTop: '8px', fontSize: '0.75rem' }}>
            Note: Because of the way YouTube captures mouse focus, you have to click outside the video for the keys to work.
          </Typography>
        </div>
      )}
    </div>
  )
}

interface TimeButtonProps {
  keyboardKey: string;
  timestamp?: Timestamp;
  player: YouTubePlayer;
  onChange(timestamp: Timestamp): void;
}

function TimeButton({ keyboardKey, timestamp, player, onChange }: TimeButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="time-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        className="kbc-button kbc-button-xs"
        style={{ width: '28px', textAlign: 'center' }}
        onClick={async () => {
          const time = await player?.getCurrentTime()
          if (time !== undefined) {
            onChange({ name: timestamp?.name, time })
          }
        }}
      >
        {keyboardKey}
      </button>

      <span>
        {timestamp ? toString(timestamp) : <i style={{ color: 'gray' }}>{'<not set>'}</i>}
      </span>

      <IconButton aria-label="edit" className="time-edit" onClick={e => setAnchorEl(e.currentTarget)}>
        <Edit/>
      </IconButton>

      {anchorEl && (
        <TimestampEditPopover
          anchorEl={anchorEl}
          timestamp={timestamp}
          onClose={() => setAnchorEl(null)}
          onChange={timestamp => {
            onChange(timestamp)
            setAnchorEl(null)
          }}
        />
      )}
    </div>
  )
}

interface TimestampEditPopoverProps {
  anchorEl: HTMLButtonElement;
  timestamp?: Timestamp;
  onChange(timestamp: Timestamp): void;
  onClose(): void;
}

function TimestampEditPopover({ anchorEl, timestamp, onChange, onClose }: TimestampEditPopoverProps) {
  const formattedTime = useMemo(() => formatSeconds(timestamp?.time || 0), [timestamp])
  const [editedName, setEditedName] = useState(timestamp?.name || '')
  const [editedTime, setEditedTime] = useState(formattedTime)
  const isValidTimestamp = useMemo(() => !isNaN(toSeconds(editedTime)), [editedTime])

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
    >
      <div style={{ display: 'flex', gap: '4px', padding: '4px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <TextField
            variant="outlined"
            size="small"
            sx={{ maxWidth: '150px' }}
            value={editedTime}
            autoFocus
            onChange={e => setEditedTime(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && isValidTimestamp) {
                onChange({ name: editedName, time: toSeconds(editedTime) })
                onClose()
              } else if (e.key === 'Escape') {
                onClose()
              }
            }}
          />
          <TextField
            variant="outlined"
            size="small"
            sx={{ maxWidth: '150px' }}
            value={editedName}
            placeholder="Name (optional)"
            onChange={e => setEditedName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && isValidTimestamp) {
                onChange({ name: editedName, time: toSeconds(editedTime) })
                onClose()
              } else if (e.key === 'Escape') {
                onClose()
              }
            }}
          />
          </div>
        <Tooltip title={isValidTimestamp ? undefined : 'Invalid format'}>
          <span>
            <IconButton aria-label="save" onClick={() => onChange({ name: editedName, time: toSeconds(editedTime) })} disabled={!isValidTimestamp}>
              <Check/>
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </Popover>
  )
}

function toString(timestamp: Timestamp): string {
  return timestamp.name || formatSeconds(timestamp.time)
}

function formatSeconds(secondsToConvert: number): string {
  const hours = Math.floor(secondsToConvert / 3600)
  const remaining = secondsToConvert % 3600
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

function toSeconds(timestamp: string): number {
  // Match [hh:]mm:ss[.SSS] or mm:ss[.SSS] or ss[.SSS]
  const re = /^(?:(\d+):)?(\d+)(?:\.(\d{1,3}))?$/;
  const match = timestamp.trim().match(re);
  if (!match) return NaN;

  const [, h, mOrS, ms] = match;
  let seconds = 0;

  if (h !== undefined) {
    // If there's a colon, h is minutes or hours
    seconds += parseInt(h, 10) * 60;
    seconds += parseInt(mOrS, 10);
  } else {
    seconds += parseInt(mOrS, 10);
  }

  if (ms !== undefined) {
    seconds += parseInt(ms.padEnd(3, '0'), 10) / 1000;
  }

  return seconds;
}
