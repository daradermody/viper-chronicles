import { Card, CardContent, CardMedia, Cards } from '../cards/Cards'
import { useMemo } from 'react'
import {Link, useParams } from 'react-router-dom'
import {Checkbox, FormControlLabel, IconButton, Typography} from '@mui/material'
import {ArrowBack} from "@mui/icons-material";

import Header from '../Header'
import { useData } from '../data/DataProvider'
import {Episode} from "../../types";

export default function SeasonInfo() {
  const { season } = useParams<{ season: string }>()

  return (
    <div>
      <Header/>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to="/">
          <IconButton aria-label="Back to season list"><ArrowBack/></IconButton>
        </Link>
        <Typography variant="h4" style={{ marginBottom: '16px' }}>Season {season}</Typography>
      </div>
      <EpisodeList season={Number(season)}/>
    </div>
  )
}

function EpisodeList({ season }: { season: number }) {
  const { episodes, watchedEpisodes, setWatched } = useData()

  const episodesInSeason = useMemo(() => episodes.filter(episode => episode.season === season), [episodes, season])

  return (
    <Cards>
      {episodesInSeason?.map((episode) => (

        <Card
          key={episode.episode}
          linkTo={`/season/${episode.season}/episode/${episode.episode}`}
          disabled={watchedEpisodes?.includes(episode.id)}
        >
          <CardMedia
            image={getThumbnail(episode)}
            alt={`Episode ${episode.episode}`}
          />
          <CardContent
            title={`${episode.episode.toString().padStart(2, '0')}. ${episode.title}`}
            subtitle={episode.releaseDate}
            description={episode.description || '<No description>'}
            actions={[
              <FormControlLabel
                sx={{ display: 'flex', alignItems: 'center' }}
                control={(
                  <Checkbox
                    size="small"
                    checked={watchedEpisodes?.includes(episode.id)}
                    onChange={e => setWatched(episode.id, e.target.checked)}
                  />
                )}
                label={<Typography variant="caption" sx={{ marginTop: '4px' }}>Watched</Typography>}
              />,
            ]}
          />
        </Card>
      ))}
    </Cards>
  )
}

function getThumbnail(episode: Episode): string {
  if (episode.thumbnail) {
    return episode.thumbnail
  } else if (episode.youtubeId) {
    return `https://i.ytimg.com/vi/${episode.youtubeId}/hqdefault.jpg`
  } else {
    return 'https://pbs.twimg.com/profile_images/80829742/scheadshot_400x400.jpg'
  }
}
