import { useEffect, useMemo, useState } from 'react'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Popover, TextField, Tooltip } from '@mui/material'
import { ArrowCircleRightOutlined, Close, MusicNote, PauseCircleOutline, PlayCircleOutline, Reply } from '@mui/icons-material'
import { YouTubePlayer } from 'youtube-player/dist/types'
import YTPlayer from 'youtube-player'
import bobsPizza from '../images/bobs_pizza.png'
import tomatoImg from '../images/tomato.png'
import tomImg from '../images/tom.png'
import { VolumeControl } from './VolumeControl'

const tracks = [
  {
    title: 'Bob\'s Pizzeria',
    videoId: '2Sc3fXLK4FE',
    img: bobsPizza,
    volumeScaler: 0.6
  },
  {
    title: 'Tomato Store',
    videoId: 'lsibwSkp0as',
    img: tomatoImg,
    volumeScaler: 0.3
  },
  {
    title: "Tom's Hip De Hop",
    videoId: 'b1JFoWM_4uQ',
    img: tomImg,
    volumeScaler: 0.2
  }
]

export function MusicPlayer({onClose}: { onClose: () => void }) {
  const [track, setTrack] = useState<number | string | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(30)
  const scaledVolume = useMemo(() => {
    const scaler = (track === undefined || typeof track === 'string') ? 0.5 : tracks[track].volumeScaler ?? 0.5
    return (volume / 100) ** 2.5 * 100 * scaler
  }, [track, volume])

  return (
    <div className="background-music-player">
      <VolumeControl volume={volume} onChange={volume => setVolume(volume)}/>
      <PlayPauseButton isPlaying={isPlaying} onClick={() => setIsPlaying(!isPlaying)} disabled={track === undefined}/>
      <TrackSelect
        track={track}
        isPlaying={isPlaying}
        onChange={track => {
          setIsPlaying(false)
          setTrack(track)
        }}
      />
      <IconButton aria-label="close player" onClick={() => onClose()} size="large">
        <Close fontSize="inherit"/>
      </IconButton>

      <Player track={track} volume={scaledVolume} isPlaying={isPlaying}/>
    </div>
  )
}

function PlayPauseButton({isPlaying, onClick, disabled}: { isPlaying: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <Tooltip
      className="play-pause-button"
      enterDelay={0}
      slotProps={{
        popper: { style: { height: '34px' } },
      }}
      title={disabled && (
        <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Choose a song
          <Reply style={{ transform: 'scaleX(-1) rotate(295deg)' }}/>
        </div>
      )}
    >
      <div>
        <IconButton aria-label="play/pause" onClick={() => onClick()} disabled={disabled} size="large">
          {(isPlaying && !disabled) ? <PauseCircleOutline fontSize="inherit"/> : <PlayCircleOutline fontSize="inherit"/>}
        </IconButton>
      </div>
    </Tooltip>
  )
}

function TrackSelect({track, isPlaying, onChange}: { track?: number | string, isPlaying?: boolean, onChange: (track: number | string) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  function handleTrackSelect(trackNumber: number | string) {
    setAnchorEl(null)
    onChange(trackNumber)
  }

  return (
    <>
      <IconButton
        onClick={e => setAnchorEl(e.currentTarget)}
        size="large"
        className={track === undefined ? 'coachmark-on-hover' : ''}
      >
        {
          track !== undefined
            ? (
              <img
                src={typeof track === 'string' ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' : tracks[track].img}
                className={isPlaying ? 'spin' : ''}
                style={{borderRadius: '50%', height: '28px', width: '28px', objectFit: 'cover'}}
                alt="track cover"
              />
            ) : <MusicNote fontSize="inherit"/>
        }
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        {tracks.map((track, i) => (
          <MenuItem key={track.title} onClick={() => handleTrackSelect(i)}>
            <ListItemIcon>
              <TrackLogo src={track.img}/>
            </ListItemIcon>
            <ListItemText>{track.title}</ListItemText>
          </MenuItem>
        ))}
        <YouTubeLinkMenuItem onSubmit={handleTrackSelect}/>
      </Menu>
    </>
  )
}

function YouTubeLinkMenuItem({onSubmit}: { onSubmit: (link: string) => void }) {
  const [customTrackAnchorEl, setCustomTrackAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <>
      <MenuItem onClick={e => setCustomTrackAnchorEl(e.currentTarget)}>
        <ListItemIcon>
          <TrackLogo src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"/>
        </ListItemIcon>
        <ListItemText>YouTube link</ListItemText>
      </MenuItem>
      {customTrackAnchorEl && (
        <CustomYouTubeLinkPopover
          anchor={customTrackAnchorEl}
          onSubmit={onSubmit}
          onClose={() => setCustomTrackAnchorEl(null)}
        />
      )}
    </>
  )
}

const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/

function CustomYouTubeLinkPopover({ anchor, onSubmit, onClose }: { anchor: HTMLElement, onSubmit: (link: string) => void; onClose: () => void }) {
  const [youtubeLink, setYoutubeLink] = useState('')
  const isValidLink = useMemo(() => ytRegex.test(youtubeLink), [youtubeLink])

  function handleSubmit() {
    if (isValidLink) {
      const videoId = new URL(youtubeLink).searchParams.get('v')!
      void onSubmit(videoId)
    }
  }

  return (
    <Popover
      open={!!anchor}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onFocus={() => document.getElementById('password-field')?.focus()}
    >
      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 8px 8px' }}>
        <TextField
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=8SwDo0ecEk8"
          style={{ width: '400px' }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValidLink) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <IconButton size="large" aria-label="login" onClick={handleSubmit} disabled={!isValidLink}>
          <ArrowCircleRightOutlined fontSize="large"/>
        </IconButton>
      </div>
    </Popover>
  )
}

function TrackLogo({ src }: { src: string }) {
  return <img src={src} style={{borderRadius: '50%', height: '40px', width: '40px', objectFit: 'cover', marginRight: '8px'}} alt="track cover"/>
}

function Player({track, volume, isPlaying}: { track?: number | string, volume: number, isPlaying: boolean }) {
  const [player, setPlayer] = useState<YouTubePlayer>()

  useEffect(() => {
    setPlayer(YTPlayer('background-music-player'))
  }, [setPlayer])

  useEffect(() => {
    if (track !== undefined) {
      void player?.loadVideoById(typeof track === 'string' ? track : tracks[track].videoId)
      void player?.pauseVideo()
    }
  }, [track])

  useEffect(() => {
    player?.setVolume(volume)
  }, [volume, player])

  useEffect(() => {
    if (isPlaying) {
      player?.playVideo()
    } else {
      player?.pauseVideo()
    }
  }, [isPlaying])


  return (
    <div style={{display: 'none'}}>
      <div id="background-music-player"/>
    </div>
  )
}
