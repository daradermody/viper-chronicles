import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Slider, styled} from '@mui/material'
import {Close, MusicNote, PauseCircleOutline, PlayCircleOutline, VolumeMute, VolumeUp} from '@mui/icons-material'
import bobsPizza from '../images/bobs_pizza.png'
import tomatoImg from '../images/tomato.png'
import {useEffect, useState} from 'react'
import {YouTubePlayer} from 'youtube-player/dist/types'
import YTPlayer from 'youtube-player'

const tracks = [
  {
    title: 'Bob\'s Pizzeria',
    videoId: '2Sc3fXLK4FE',
    img: bobsPizza
  },
  {
    title: 'Tomato Store',
    videoId: 'lsibwSkp0as',
    img: tomatoImg
  },
  {
    title: "Tom's Hip De Hop",
    videoId: 'b1JFoWM_4uQ',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAviPPV_TNRXfywbgL4Evq2AaOwSG64IYdAA&s'
  }
]

export function MusicPlayer({onClose}: { onClose?: () => void }) {
  const [track, setTrack] = useState<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)

  const [volume, setVolume] = useState(20)
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
      <IconButton aria-label="close player" onClick={() => onClose?.()} size="large">
        <Close fontSize="inherit"/>
      </IconButton>

      <Player track={track} volume={volume} isPlaying={isPlaying}/>
    </div>
  )

}
function VolumeControl({volume, onChange}: { volume: number, onChange: (volume: number) => void }) {

  const [unmutedVolume, setUnmutedVolume] = useState<undefined | number>(undefined)
  return (
    <div style={{display: 'flex', alignItems: 'center', width: '150px', marginLeft: '16px'}}>
      <ColouredSlider aria-label="Volume" value={volume} onChange={(_e, value) => onChange(value as number)}/>
      <IconButton
        aria-label="mute"
        onClick={() => {
          if (volume) {
            setUnmutedVolume(volume)
            onChange(0)
          } else {
            onChange(unmutedVolume || 20)
            setUnmutedVolume(undefined)
          }
        }}
        size="large"
      >
        {!volume ? <VolumeMute style={{marginLeft: '-4px', marginRight: '4px'}} fontSize="inherit"/> : <VolumeUp fontSize="inherit"/>}
      </IconButton>
    </div>
  )
}

const ColouredSlider = styled(Slider)(() => ({
  color: '#007bff',
  '& .MuiSlider-thumb': {
    backgroundColor: '#318d2d',
  },
  '& .MuiSlider-track': {
    backgroundColor: '#318d2d',
    borderColor: '#318d2d'
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#318d2d'
  }
}));


function PlayPauseButton({isPlaying, onClick, disabled}: { isPlaying: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <IconButton aria-label="play/pause" onClick={() => onClick()} disabled={disabled} size="large">
      {(isPlaying && !disabled) ? <PauseCircleOutline fontSize="inherit"/> : <PlayCircleOutline fontSize="inherit"/>}
    </IconButton>
  )

}

function TrackSelect({track, isPlaying, onChange}: { track?: number, isPlaying?: boolean, onChange: (track: number) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  function handleTrackSelect(trackNumber: number) {
    setAnchorEl(null)
    onChange(trackNumber)
  }

  return (
    <span>
      <IconButton onClick={e => setAnchorEl(e.currentTarget)} size="large">
        {
          track !== undefined
            ? <img
              src={tracks[track].img}
              className={isPlaying ? 'spin' : ''}
              style={{borderRadius: '50%', height: '28px', width: '28px', objectFit: 'cover'}}
              alt="track cover"
            />
            : <MusicNote fontSize="inherit"/>
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
              <img src={track.img} style={{borderRadius: '50%', height: '40px', width: '40px', objectFit: 'cover', marginRight: '8px'}} alt="track cover"/>
            </ListItemIcon>
            <ListItemText>{track.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </span>
  )
}

function Player({track, volume, isPlaying}: { track?: number, volume: number, isPlaying: boolean }) {
  const [player, setPlayer] = useState<YouTubePlayer>()

  useEffect(() => {
    setPlayer(YTPlayer('background-music-player'))
  }, [setPlayer])

  useEffect(() => {
    if (track !== undefined) {
      void player?.cueVideoById(tracks[track].videoId)
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