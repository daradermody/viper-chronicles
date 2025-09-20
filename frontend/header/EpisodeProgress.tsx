import {useData} from '../data/DataProvider'
import {LinearProgress, linearProgressClasses, styled} from '@mui/material'

export function EpisodeProgress({show}: { show: 'computerChronicles' | 'netCafe' }) {
  const episodeData = useData()
  const {episodes, watched} = episodeData[show]

  const percent = Math.floor(watched.length / episodes.length * 100)
  return (
    <div className="hide-sm-down" style={{position: 'relative'}}>
      <ThickLinearProgress variant="determinate" value={percent}/>
      <span style={{position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center'}}>{watched.length} / {episodes.length} ({percent}%)</span>
    </div>
  )
}

const ThickLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: 20,
  borderRadius: 5,
  backgroundColor: '#0000001c',
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#308d2c'
  },
}))