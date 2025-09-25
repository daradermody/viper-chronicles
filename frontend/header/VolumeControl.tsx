import {useState} from 'react'
import {IconButton, Slider, styled} from '@mui/material'
import {VolumeMute, VolumeUp} from '@mui/icons-material'

export function VolumeControl({volume, onChange}: { volume: number, onChange: (volume: number) => void }) {
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
}))