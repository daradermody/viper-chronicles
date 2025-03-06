import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Episode, seasons } from '../../episodes'
import Header from '../Header'
import { Link } from 'react-router-dom'
import { useData } from '../data/DataProvider'

export default function Home() {
  return (
    <div>
      <Header/>
      <p>Watch and enjoy the magic that Stewart Cheifet and his team created.</p>

      <SeasonList/>
    </div>
  )
}

function SeasonList() {
  const { watchedEpisodes, episodes } = useData()

  const episodesBySeason = useMemo(
    () => Object.groupBy(episodes || [], episode => episode.season),
    [episodes],
  )

  const watchedEpisodesBySeason = useMemo(() => {
    if (!watchedEpisodes) {
      return {}
    }
    const watchedEpisodesBySeason: Record<string, Episode[]> = {}
    for (const [season, episodes] of Object.entries(episodesBySeason)) {
      watchedEpisodesBySeason[season] = episodes?.filter(episode => watchedEpisodes.includes(episode.archiveOrgId)) || []
    }
    return watchedEpisodesBySeason
  }, [watchedEpisodes, episodesBySeason])


  return (
    <div style={{ display: 'grid', gap: '16px 32px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
      {Object.entries(episodesBySeason).map(([season, episodes]) => (
        <Card key={season} sx={{ width: '100%', maxWidth: 500 }}>
          <Link to={`/season/${season}`} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            <CardActionArea disableRipple sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                width="100"
                height="150"
                sx={{ objectFit: 'cover', width: '150px', display: 'inline-block' }}
                image={seasons[season].thumbnail || 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/kuLf05Qw4Ki5brXfrUaK1iTowr9.jpg'}
                alt={`Season ${season}`}
              />
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="h5">
                  Season {season} ({episodes?.[0]?.releaseDate.split('-')[0]})
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {episodes?.length} episodes {watchedEpisodesBySeason[season] ? `(${watchedEpisodesBySeason[season].length} watched)` : ''}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      ))}
    </div>
  )
}

function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    fetch('/api/episodes')
      .then(async response => setEpisodes(await response.json()))
      .catch(setError)
  }, [setEpisodes])

  return { episodes, loading, error }
}
