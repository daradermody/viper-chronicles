import {useEffect, useState} from 'react'
import {IconButton, Tooltip} from '@mui/material'
import {Close} from '@mui/icons-material'
import {VolumeControl} from './VolumeControl'
import shenmueImg from '../images/shenmue.png'
import cheifetImg from '../images/cheifet.png'
import viperImg from '../images/viper.png'

const gainNodes: GainNode[] = []

export function Soundboard({onClose}: {onClose: () => void}) {
  const [volume, setVolume] = useState(30)

  useEffect(() => {
    for (const gainNode of gainNodes) {
      gainNode.gain.value = (volume / 100) ** 2.5
    }
  }, [volume])

  return (
    <div className="soundboard">
      <VolumeControl volume={volume} onChange={volume => setVolume(volume)}/>
      <SoundboardButton onClick={() => playSound('shenmue', volume)} img={shenmueImg}/>
      <Tooltip title="Coming soon" enterDelay={0} slotProps={{ popper: { style: { height: '23px' } } }}>
        <span><SoundboardButton img={cheifetImg} disabled/></span>
      </Tooltip>
      <Tooltip title="Coming soon" enterDelay={0} slotProps={{ popper: { style: { height: '23px' } } }}>
        <span><SoundboardButton img={viperImg} disabled/></span>
      </Tooltip>
      <IconButton aria-label="close soundboard" onClick={() => onClose()} size="large">
        <Close fontSize="inherit"/>
      </IconButton>
    </div>
  )
}

function SoundboardButton({img, onClick, disabled}: {img: string, onClick?: () => void, disabled?: boolean}) {
  return (
    <>
      <IconButton onClick={() => onClick?.()} size="large" style={{ padding: '4px' }} disabled={disabled}>
        <img
          src={img}
          style={{
            borderRadius: '50%',
            height: '50px',
            width: '50px',
            objectFit: 'cover',
            opacity: disabled ? 0.5 : 1,
            filter: disabled ? 'grayscale(100%)' : 'none'
          }}
          alt="soundboard button"
        />
      </IconButton>
    </>
  )
}

async function playSound(type: string, volume: number) {
  const audioContext = new window.AudioContext()
  const response = await fetch(`/api/soundboard/${type}`)
  const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer())

  const source = audioContext.createBufferSource()
  const gainNode = audioContext.createGain()
  gainNode.gain.value = volume / 100
  gainNodes.push(gainNode)
  source.buffer = audioBuffer
  source.connect(gainNode)
  gainNode.connect(audioContext.destination)
  source.start(0)
  source.onended = () => {
    source.disconnect()
    gainNode.disconnect()
    audioContext.close()
    gainNodes.splice(gainNodes.indexOf(gainNode), 1)
  }
}
