import { Card, CardContent, CardMedia, Cards } from './cards/Cards'

export interface Season {
  season: number
  year?: string;
  thumbnail: string;
  numEpisodes: number;
  numWatched: number;
  url: string;
}

export function SeasonList({ seasons, show }: { seasons: Season[]; show: 'computerChronicles' | 'netCafe' }) {
  return (
    <Cards small>
      {seasons.map(season => (
        <Card key={season.season} linkTo={season.url} imageLeftOnMobile>
          <CardMedia
            image={season.thumbnail}
            alt={`Season ${season.season}`}
            orientation="portrait"
            style={{ minHeight: show === 'computerChronicles' ? '150px' : '76px' }}
          />
          <CardContent
            title={`Season ${season.season}${season.year ? ` (${season.year})` : ''}`}
            subtitle={`${season.numEpisodes} episodes (${season.numWatched} watched)`}
          />
        </Card>
      ))}
    </Cards>
  )
}
