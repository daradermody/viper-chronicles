import { Typography } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Episode } from '../../episodes'
import Header from '../Header'
import { useData } from '../data/DataProvider'

export default function EpisodeInfo() {
  const { season, episode: episodeNumber } = useParams<{ season: string; episode: string }>()
  const { episodes } = useData()

  const episode = useMemo(
    () => episodes.find(ep => ep.season === Number(season) && ep.episode === Number(episodeNumber)),
    [season, episodeNumber],
  )!

  return (
    <div>
      <Header/>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3">{getEpisodeShortCode(episode)} {episode.title}</Typography>
        <Typography variant="body1" sx={{ maxWidth: '1000px', margin: '10px 0', textAlign: 'center' }}>
          {episode.description}
        </Typography>

        <div className="spinner" style={{ height: '500px', width: '800px', border: '1px solid lightgray' }}>
          <iframe
            src={`http://archive.org/embed/${episode.archiveOrgId}`}
            style={{ height: '100%', width: '100%', border: 0 }}
            allowFullScreen
            allow="encrypted-media;"
          />
        </div>

      </div>
    </div>
  )
}


function getEpisodeShortCode(episode: Episode) {
  return `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`
}
