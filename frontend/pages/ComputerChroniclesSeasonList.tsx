import { IconButton, Typography } from '@mui/material'
import { Season, SeasonList } from '../SeasonList'
import { useData } from '../data/DataProvider'
import { useMemo } from 'react'
import { Episode } from '../../types'
import { Link } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'

export const seasonThumbnails: Record<string, string | undefined> = {
  1: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/v0zwS50Hb0DZX6TztRLFuq5LVa3.jpg',
  2: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/2FBjiSo2nVLkttjzUooHPrhrHOX.jpg',
  3: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/6P9oIwcInbNB9nB8mWV2PAF3e87.jpg',
  4: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/fqsHTnLY0VXbPVkaXbFIFQAWPqz.jpg',
  5: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/zp8Y1UU9njtPQx0bEOJW5PYlueA.jpg',
  6: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/lUAMWCTNlDxwnV8eiNqwgxoZlk0.jpg',
}

export default function ComputerChroniclesSeasonList() {
  const { computerChronicles: { episodes, watched } } = useData()

  const watchedEpisodesBySeason = useMemo(() => (episodes && watched) ? getWatchedEpisodesBySeason(episodes, watched) : {}, [watched, episodes])

  const seasons = useMemo(() => episodes ? getSeasons(episodes, watchedEpisodesBySeason) : [], [episodes, watchedEpisodesBySeason])

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to="/">
          <IconButton aria-label="Back to show list"><ArrowBack/></IconButton>
        </Link>
        <Typography variant="h4">Computer Chronicles</Typography>
      </div>

      <p>
        Computer Chronicles is an American half-hour television series that was broadcast on PBS public television from 1984 to 2002. It documented and explored the personal computer as it grew from its infancy in the early 80s to its rise in the global market at the turn of the 21st century. Episodes reviewed a variety of home and business computers, including hardware accessories, software and other consumer computing devices and gadgetry.
      </p>
      <SeasonList seasons={seasons} show="computerChronicles"/>
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
      thumbnail: seasonThumbnails[season] || 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/kuLf05Qw4Ki5brXfrUaK1iTowr9.jpg',
      numEpisodes: episodes?.length || 0,
      numWatched: watchedBySeason[season] || 0,
      year: years.length === 1 ? years[0] : `${years[0]}–${years.at(-1)}`,
      url: `/computerChronicles/season/${season}`,
    })
  }
  return seasons
}
