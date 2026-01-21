import {IconButton, Typography} from '@mui/material'
import {Link, useParams} from 'react-router-dom'
import {ArrowBack} from '@mui/icons-material'
import {YouTubePlayer} from '../VideoPlayer'
import {useYoutubeVideo} from '../data/UseYoutubeVideos'

export default function YoutubeVideo() {
  const { id } = useParams<{ id: string }>()
  const {video, loading, error} = useYoutubeVideo(id!)

  if (error) {
    return <p>Error loading video: {error.message}</p>
  }

  if (loading || !video) {
    return <p>Loading video...</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to="/youtube">
          <IconButton aria-label="Back to video list"><ArrowBack/></IconButton>
        </Link>

        <Typography variant="h4" style={{ marginBottom: '16px' }}>
          {video.title}
        </Typography>
      </div>

      <YouTubePlayer key={video.id} show="youtube" videoId={video.id} episodeId={video.id}/>
    </div>
  )
}
