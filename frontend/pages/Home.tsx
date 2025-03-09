import { Card, CardContent, CardMedia, Cards } from '../cards/Cards'
import { useEffect, useMemo, useState } from 'react'

import Header from '../Header'
import { useData } from '../data/DataProvider'
import { Episode } from '../../types'

export const seasonThumbnails: Record<string, string | undefined> = {
  1: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/v0zwS50Hb0DZX6TztRLFuq5LVa3.jpg',
  2: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/2FBjiSo2nVLkttjzUooHPrhrHOX.jpg',
  3: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/6P9oIwcInbNB9nB8mWV2PAF3e87.jpg',
  4: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/fqsHTnLY0VXbPVkaXbFIFQAWPqz.jpg',
  5: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/zp8Y1UU9njtPQx0bEOJW5PYlueA.jpg',
  6: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/lUAMWCTNlDxwnV8eiNqwgxoZlk0.jpg',
  7: undefined,
}

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
      watchedEpisodesBySeason[season] = episodes?.filter(episode => watchedEpisodes.includes(episode.id)) || []
    }
    return watchedEpisodesBySeason
  }, [watchedEpisodes, episodesBySeason])


  return (
    <Cards>
      {Object.entries(episodesBySeason).map(([season, episodes]) => (
        <Card key={season} linkTo={`/season/${season}`} imageLeftOnMobile>
          <CardMedia
            image={seasonThumbnails[season] || 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/kuLf05Qw4Ki5brXfrUaK1iTowr9.jpg'}
            alt={`Season ${season}`}
            orientation="portrait"
          />
          <CardContent
            title={`Season ${season} (${episodes?.[0]?.releaseDate.split('-')[0]})`}
            subtitle={`${episodes?.length} episodes ${watchedEpisodesBySeason[season] ? `(${watchedEpisodesBySeason[season].length} watched)` : ''}`}
          />
        </Card>
      ))}
    </Cards>
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
