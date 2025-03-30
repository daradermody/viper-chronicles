import {Checkbox, FormControlLabel, IconButton, Typography} from '@mui/material'
import {useMemo} from 'react'
import {Link, useParams} from 'react-router-dom'
import {ArrowBack} from '@mui/icons-material'

import {Episode} from '../../types'
import { useData } from '../data/DataProvider'
import {VideoPlayer} from '../VideoPlayer'
import { useAuth } from '../AuthProvider'

export default function EpisodeInfo() {
  const { show, season, episode: episodeNumber } = useParams<{ show: 'computerChronicles' | 'netCafe'; season: string; episode: string }>()
  const episodeData = useData()
  const {isLoggedIn} = useAuth()
  const { episodes, watched, setWatched } = episodeData[show!]

  const episode = useMemo(
    () => episodes?.find(ep => ep.season === Number(season) && ep.episode === Number(episodeNumber)),
    [episodes, season, episodeNumber],
  )!

  if(!episode) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to={`/${show}/season/${season}`}>
          <IconButton aria-label="Back to episode list list"><ArrowBack/></IconButton>
        </Link>

        <Typography variant="h4" style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <span className="hide-sm-down">{show === 'computerChronicles' ? 'Computer Chronicles' : 'Net Cafe'} / Season {season} /</span>
          <span>E{episodeNumber?.toString().padStart(2, '0')} {episode.title}</span>
        </Typography>
      </div>
      <Typography variant="body1" sx={{ maxWidth: '1000px', margin: '10px 0' }}>
        {episode.description}
      </Typography>

      {isLoggedIn && (
        <FormControlLabel
          control={<Checkbox checked={watched?.includes(episode.id)} onChange={e => setWatched(episode.id, e.target.checked)}/>}
          label={<Typography variant="caption" sx={{ marginTop: '4px' }}>Watched</Typography>}
        />
      )}

      <VideoPlayer key={episode.id} episode={episode}/>
    </div>
  )
}

function getEpisodeShortCode(episode: Episode) {
  return `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`
}
