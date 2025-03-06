import { Card, CardActionArea, CardContent, CardMedia, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../Header'
import { useData } from '../data/DataProvider'

export default function SeasonInfo() {
  const { season } = useParams<{ season: string }>()

  return (
    <div>
      <Header/>
      <EpisodeList season={Number(season)}/>
    </div>
  )
}

function EpisodeList({ season }: { season: number }) {
  const { episodes, watchedEpisodes, setWatched } = useData()

  const episodesInSeason = useMemo(() => episodes.filter(episode => episode.season === season), [episodes, season])

  return (
    <div style={{ display: 'grid', gap: '16px 32px', gridTemplateColumns: 'repeat(auto-fit, minmax(530px, 1fr))' }}>
      {episodesInSeason?.map((episode) => (
        <Card
          key={episode.episode}
          sx={{
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            color: watchedEpisodes?.includes(episode.archiveOrgId) ? '#878787' : '',
            backgroundColor: watchedEpisodes?.includes(episode.archiveOrgId) ? '#ebe7e7' : '',
          }}
        >
          <Link to={`/season/${episode.season}/episode/${episode.episode}`}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
          >
            <CardActionArea disableRipple sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                width="100px"
                sx={{
                  height: '100%',
                  width: '250px',
                  flexShrink: 0,
                  opacity: watchedEpisodes?.includes(episode.archiveOrgId) ? 0.5 : 1,
                }}
                image={episode.thumbnail || 'https://pbs.twimg.com/profile_images/80829742/scheadshot_400x400.jpg'}
                alt={`Episode ${episode.episode}`}
              />
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="body1">
                  <b>{episode.episode.toString().padStart(2, '0')}. {episode.title}</b>
                </Typography>

                <Typography variant="caption" sx={{ marginBottom: '16px' }}>
                  <i>{episode.releaseDate}</i>
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: '-webkit-box',
                    '-webkit-line-clamp': '3',
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {episode.description || '<No description>'}
                </Typography>

                <div onMouseDown={e => e.stopPropagation()} style={{ display: 'inline-block' }}>
                  <FormControlLabel
                    sx={{ display: 'flex', alignItems: 'center' }}
                    control={(
                      <Checkbox
                        size="small"
                        checked={watchedEpisodes?.includes(episode.archiveOrgId)}
                        onChange={e => setWatched(episode.archiveOrgId, e.target.checked)}
                      />
                    )}
                    label={<Typography variant="caption" sx={{ marginTop: '4px' }}>Watched</Typography>}
                  />
                </div>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      ))}
    </div>
  )
}

