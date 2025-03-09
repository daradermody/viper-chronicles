import {Checkbox, FormControlLabel, IconButton, Typography} from '@mui/material'
import { useMemo } from 'react'
import {Link, useParams} from 'react-router-dom'
import {ArrowBack} from "@mui/icons-material";

import { Episode } from '../../types'
import Header from '../Header'
import { useData } from '../data/DataProvider'

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


function getEpisodeShortCode(episode: Episode) {
  return `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`
}
