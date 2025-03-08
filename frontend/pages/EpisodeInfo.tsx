import { Typography } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Episode } from '../../types'
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
        <Typography variant="h4">{getEpisodeShortCode(episode)} {episode.title}</Typography>
        <Typography variant="body1" sx={{ maxWidth: '1000px', margin: '10px 0', textAlign: 'center' }}>
          {episode.description}
        </Typography>

        <Player episode={episode}/>
      </div>
    </div>
  )
}

function Player({ episode }: { episode: Episode }) {
  if (episode.youtubeId) {
    return (
      <iframe
        style={{ maxWidth: '800px', aspectRatio: '4 / 3', width: '100%' }}
        src={`https://www.youtube.com/embed/${episode.youtubeId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  } else {
    return (
      <div className="video-spinner">
        <iframe
          src={`https://archive.org/embed/${episode.archiveOrgId}`}
          style={{ height: '100%', width: '100%', border: 0 }}
          allowFullScreen
          allow="encrypted-media;"
        />
      </div>
    )
  }
}


function getEpisodeShortCode(episode: Episode) {
  return `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`
}
