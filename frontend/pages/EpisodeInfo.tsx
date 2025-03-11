import {Checkbox, FormControlLabel, IconButton, Typography} from '@mui/material'
import {useMemo} from 'react'
import {Link, useParams} from 'react-router-dom'
import {ArrowBack} from '@mui/icons-material'

import {Episode} from '../../types'
import Header from '../Header'
import {useData} from '../data/DataProvider'
import {VideoPlayer} from '../VideoPlayer'

export default function EpisodeInfo() {
  const { season, episode: episodeNumber } = useParams<{ season: string; episode: string }>()
  const { episodes, watchedEpisodes, setWatched } = useData()

  const episode = useMemo(
    () => episodes.find(ep => ep.season === Number(season) && ep.episode === Number(episodeNumber)),
    [season, episodeNumber],
  )!

  return (
    <div>
      <Header/>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link to={`/season/${season}`}>
            <IconButton aria-label="Back to episode list list"><ArrowBack/></IconButton>
          </Link>
          <Typography variant="h4">{getEpisodeShortCode(episode)} {episode.title}</Typography>
        </div>
        <Typography variant="body1" sx={{ maxWidth: '1000px', margin: '10px 0', textAlign: 'center' }}>
          {episode.description}
        </Typography>

        <FormControlLabel
          control={<Checkbox checked={watchedEpisodes?.includes(episode.id)} onChange={e => setWatched(episode.id, e.target.checked)}/>}
          label={<Typography variant="caption" sx={{ marginTop: '4px' }}>Watched</Typography>}
        />

        <VideoPlayer episode={episode}/>
      </div>
    </div>
  )
}

function getEpisodeShortCode(episode: Episode) {
  return `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`
}
