import { Card, CardContent, CardMedia, Cards, getThumbnail } from '../cards/Cards'
import { useMemo } from 'react'
import {Link, useParams } from 'react-router-dom'
import {Checkbox, FormControlLabel, IconButton, Typography} from '@mui/material'
import {ArrowBack} from "@mui/icons-material";

import { useData } from '../data/DataProvider'
import { useAuth } from '../AuthProvider'

export default function EpisodeList() {
  const { show, season } = useParams<{ show: 'computerChronicles' | 'netCafe'; season: string }>()

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to={`/${show}`}>
          <IconButton aria-label="Back to season list"><ArrowBack/></IconButton>
        </Link>
        <Typography variant="h4" style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <span className="hide-sm-down">{show === 'computerChronicles' ? 'Computer Chronicles' : 'Net Cafe'} /</span>
          <span>Season {season}</span>
        </Typography>
      </div>
      <EpisodeList2 season={Number(season)}/>
    </div>
  )
}

function EpisodeList2({ season }: { season: number }) {
  const episodeData = useData()
  const {isLoggedIn} = useAuth()
  const show = useParams<{ show: string }>().show as 'computerChronicles' | 'netCafe'
  const { episodes, watched, setWatched } = episodeData[show]

  const episodesInSeason = useMemo(() => (episodes || []).filter(episode => episode.season === season), [episodes, season])

  return (
    <Cards>
      {episodesInSeason?.map((episode) => (

        <Card
          key={episode.episode}
          linkTo={`/${show}/season/${episode.season}/episode/${episode.episode}`}
          disabled={watched?.includes(episode.id)}
        >
          <CardMedia
            image={getThumbnail(episode)}
            alt={`Episode ${episode.episode}`}
          />
          <CardContent
            title={`${episode.episode.toString().padStart(2, '0')}. ${episode.title}`}
            subtitle={episode.releaseDate}
            description={episode.description || '<No description>'}
            actions={isLoggedIn ? [
              <FormControlLabel
                sx={{ display: 'flex', alignItems: 'center' }}
                control={(
                  <Checkbox
                    size="small"
                    checked={watched?.includes(episode.id)}
                    onChange={e => setWatched(episode.id, e.target.checked)}
                  />
                )}
                label={<Typography variant="caption" sx={{ marginTop: '4px' }}>Watched</Typography>}
              />,
            ] : undefined}
          />
        </Card>
      ))}
    </Cards>
  )
}

