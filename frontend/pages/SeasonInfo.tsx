import { Card, CardContent, CardMedia, Cards } from '../cards/Cards'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../Header'
import { useData } from '../data/DataProvider'
import { Checkbox, FormControlLabel, Typography } from '@mui/material'

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
    <Cards>
      {episodesInSeason?.map((episode) => (

        <Card
          key={episode.episode}
          linkTo={`/season/${episode.season}/episode/${episode.episode}`}
          disabled={watchedEpisodes?.includes(episode.archiveOrgId)}
        >
          <CardMedia
            image={episode.thumbnail || 'https://pbs.twimg.com/profile_images/80829742/scheadshot_400x400.jpg'}
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
                    checked={watchedEpisodes?.includes(episode.archiveOrgId)}
                    onChange={e => setWatched(episode.archiveOrgId, e.target.checked)}
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

  // return (
  //   <div className="card-grid">
  //     {episodesInSeason?.map((episode) => (
  //       <Card
  //         key={episode.episode}
  //         sx={{
  //           width: '100%',
  //           maxWidth: '800px',
  //           display: 'flex',
  //           color: watchedEpisodes?.includes(episode.archiveOrgId) ? '#878787' : '',
  //           backgroundColor: watchedEpisodes?.includes(episode.archiveOrgId) ? '#ebe7e7' : '',
  //         }}
  //       >
  //         <Link
  //           to={`/season/${episode.season}/episode/${episode.episode}`}
  //           style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}
  //         >
  //           <CardActionArea disableRipple className="card-content">
  //             <CardMedia
  //               component="img"
  //               width="100px"
  //               sx={{
  //                 opacity: watchedEpisodes?.includes(episode.archiveOrgId) ? 0.5 : 1,
  //               }}
  //               image={episode.thumbnail || 'https://pbs.twimg.com/profile_images/80829742/scheadshot_400x400.jpg'}
  //               alt={`Episode ${episode.episode}`}
  //             />
  //             <CardContent sx={{ width: '100%', padding: '2px 12px' }}>
  //               <Typography variant="body1">
  //                 <b>{episode.episode.toString().padStart(2, '0')}. {episode.title}</b>
  //               </Typography>
  //
  //               <Typography variant="caption" sx={{ marginBottom: '16px' }}>
  //                 <i>{episode.releaseDate}</i>
  //               </Typography>
  //
  //               <Typography
  //                 variant="caption"
  //                 sx={{
  //                   display: '-webkit-box',
  //                   '-webkit-line-clamp': '3',
  //                   '-webkit-box-orient': 'vertical',
  //                   overflow: 'hidden',
  //                 }}
  //               >
  //                 {episode.description || '<No description>'}
  //               </Typography>
  //
  //               <div onClick={e => e.stopPropagation()} style={{ display: 'inline-block' }}>
  //                 <FormControlLabel
  //                   sx={{ display: 'flex', alignItems: 'center' }}
  //                   control={(
  //                     <Checkbox
  //                       size="small"
  //                       checked={watchedEpisodes?.includes(episode.archiveOrgId)}
  //                       onChange={e => setWatched(episode.archiveOrgId, e.target.checked)}
  //                     />
  //                   )}
  //                   label={<Typography variant="caption" sx={{ marginTop: '4px' }}>Watched</Typography>}
  //                 />
  //               </div>
  //             </CardContent>
  //           </CardActionArea>
  //         </Link>
  //       </Card>
  //     ))}
  //   </div>
  // )
}

