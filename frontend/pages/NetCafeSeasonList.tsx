import { IconButton, Typography } from '@mui/material'
import { Season, SeasonList } from '../SeasonList'
import { useData } from '../data/DataProvider'
import { useMemo } from 'react'
import { Episode } from '../../types'
import { Link } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'

export const seasonThumbnails: Record<string, string | undefined> = {}

export default function ComputerChroniclesSeasonList() {
  const { netCafe: { episodes, watched } } = useData()

  const watchedEpisodesBySeason = useMemo(() => (episodes && watched) ? getWatchedEpisodesBySeason(episodes, watched) : {}, [watched, episodes])

  const seasons = useMemo(() => episodes ? getSeasons(episodes, watchedEpisodesBySeason) : [], [episodes, watchedEpisodesBySeason])

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to="/">
          <IconButton aria-label="Back to show list"><ArrowBack/></IconButton>
        </Link>
        <Typography variant="h4">Net Cafe</Typography>
      </div>

      <p>
        Net Cafe (or Cheifet's Net Cafe, formerly The Internet Cafe) was a US television series documenting the internet boom of the late 1990s. It was broadcast from 1996 to 2002 and hosted by Stewart Cheifet, Jane Wither, and Andrew deVries. The show was effectively a spin-off of the PBS series Computer Chronicles.
      </p>
      <SeasonList seasons={seasons} show="netCafe"/>
    </div>
  )
}

function getWatchedEpisodesBySeason(episodes: Episode[], watched: string[]) {
  const watchedEpisodesBySeason: Record<string, number> = {}
  for (const watchedId of watched) {
    const season = episodes.find(episode => episode.id === watchedId)?.season
    if (!season) {
      console.error('Invalid watched episode id:', watchedId)
      continue
    }
    watchedEpisodesBySeason[season] = (watchedEpisodesBySeason[season] || 0) + 1
  }
  return watchedEpisodesBySeason
}

function getSeasons(episodes: Episode[], watchedBySeason: Record<string, number>) {
  const seasons: Season[] = []
  const episodesBySeason = Object.groupBy(episodes || [], episode => episode.season)
  for (const [season, episodes] of Object.entries(episodesBySeason)) {
    const years = Array.from(new Set((episodes || []).map(episode => episode.releaseDate.split('-')[0]))).sort()
    seasons.push({
      season: Number(season),
      thumbnail: seasonThumbnails[season] || 'https://64.media.tumblr.com/8f444768d540385065e63c7906000654/tumblr_inline_p9k2c8FTeZ1qhjsuk_500.jpg',
      numEpisodes: episodes?.length || 0,
      numWatched: watchedBySeason[season] || 0,
      url: `/netCafe/season/${season}`,
    })
  }
  return seasons
}
