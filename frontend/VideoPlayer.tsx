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

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function YouTubeKeyControl({ player }: { player: YouTubePlayer }) {
  const [showYtControls, setShowYtControls] = useState(false)
  const [numberToTime, setNumberToTime] = useState<Record<string, number>>({})

  useEffect(() => {
    async function handleKeydown(e: KeyboardEvent) {
      if ((e.target as any)?.tagName !== 'INPUT') {
        if (numberToTime[e.key] !== undefined) {
          player?.seekTo(numberToTime[e.key], true)
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
            <TimeButton
              key={key}
              keyboardKey={key}
              player={player!}
              time={numberToTime[key]}
              onTimeSelect={time => setNumberToTime(prev => ({ ...prev, [key]: time }))}
            />
          ))}
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
  time?: number;
  player: YouTubePlayer;
  onTimeSelect(time: number): void;
}

function TimeButton({ keyboardKey, time, player, onTimeSelect }: TimeButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="time-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        className="kbc-button kbc-button-xs"
        onClick={async () => {
          const time = await player?.getCurrentTime()
          if (time !== undefined) {
            onTimeSelect(time)
          }
        }}
      >
        {keyboardKey}
      </button>

      {time === undefined ? <i style={{ color: 'gray' }}>{'<not set>'}</i> : toTimestamp(time)}

      <IconButton aria-label="edit" className="time-edit" onClick={e => setAnchorEl(e.currentTarget)}>
        <Edit/>
      </IconButton>

      {anchorEl && (
        <TimestampEditPopover
          anchorEl={anchorEl}
          time={time}
          onClose={() => setAnchorEl(null)}
          onTimeSelect={time => {
            onTimeSelect(time)
            setAnchorEl(null)
          }}
        />
      )}
    </div>
  )
}

interface TimestampEditPopoverProps {
  anchorEl: HTMLButtonElement;
  time?: number;
  onTimeSelect(time: number): void;
  onClose(): void;
}

function TimestampEditPopover({ anchorEl, time, onTimeSelect, onClose }: TimestampEditPopoverProps) {
  const timestamp = useMemo(() => toTimestamp(time || 0), [time])
  const [editedTime, setEditedTime] = useState(timestamp)
  const isValidTimestamp = useMemo(() => !isNaN(toSeconds(editedTime)), [editedTime])

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      sx={{ d: 'flex', gap: '4px' }}
    >
      <TextField
        variant="outlined" size="small"
        sx={{ maxWidth: '100px' }}
        value={editedTime}
        autoFocus
        onChange={e => setEditedTime(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && isValidTimestamp) {
            onTimeSelect(toSeconds(editedTime))
            onClose()
          } else if (e.key === 'Escape') {
            onClose()
          }
        }}
      />
      <Tooltip title={isValidTimestamp ? undefined : 'Invalid format'}>
        <span>
          <IconButton aria-label="save" onClick={() => onTimeSelect(toSeconds(editedTime))} disabled={!isValidTimestamp}>
            <Check/>
          </IconButton>
        </span>
      </Tooltip>
    </Popover>
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
