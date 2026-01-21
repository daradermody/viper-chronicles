import {useMemo, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button, IconButton, Popover, TextField, Typography} from '@mui/material'
import {Add, ArrowBack, Delete} from '@mui/icons-material'
import {Card, CardContent, CardMedia, Cards} from '../cards/Cards'
import {useAuth} from '../AuthProvider'
import type {YoutubeVideo} from '../../api/youtube/videos'
import {useYoutubeVideos} from '../data/UseYoutubeVideos'

export default function YoutubeVideoList() {
  const { videos, loading, error, addVideo, deleteVideo } = useYoutubeVideos()
  const { isLoggedIn } = useAuth()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link to="/">
            <IconButton aria-label="Back to show list"><ArrowBack/></IconButton>
          </Link>
          <Typography variant="h4">YouTube videos</Typography>
        </div>
        {isLoggedIn && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AddVideoButton disabled={loading} onAdd={addVideo}/>
          </div>
        )}
      </div>


      {loading && <p>Loading videos...</p>}
      {error && <p>Error loading videos: {error.message}</p>}
      {!loading && !error && <VideoList videos={videos} onDelete={deleteVideo}/>}
    </div>
  )
}

function AddVideoButton({ disabled, onAdd }: { disabled: boolean; onAdd: (videoId: string) => void | Promise<void> }) {
  const [videoUrl, setVideoUrl] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [adding, setAdding] = useState(false)

  const parsedVideoId = useMemo(() => parseYoutubeVideoId(videoUrl), [videoUrl])

  async function handleAdd() {
    setAdding(true)
    try {
      await onAdd(parsedVideoId!)
      setVideoUrl('')
      setAnchorEl(null)
    } finally {
      setAdding(false)
    }
  }

  return (
    <>
      <Button startIcon={<Add/>}  onClick={e => setAnchorEl(anchorEl ? null : e.currentTarget)}>
        Add
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <div
          style={{
            padding: '8px',
            backgroundColor: 'white',
            boxShadow: '0px 3px 5px -1px rgb(0 0 0 / 0.2), 0px 6px 10px 0px rgb(0 0 0 / 0.14), 0px 1px 18px 0px rgb(0 0 0 / 0.12)',
            display: 'flex',
            gap: '8px'
        }}
        >
          <TextField
            placeholder="https://www.youtube.com/watch?v=8SwDo0ecEk8"
            variant="outlined"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleAdd()
              }
            }}
            fullWidth
            disabled={disabled || adding}
            style={{ width: '400px' }}
            size="small"
            autoComplete="off"
            autoFocus
          />
          <Button variant="outlined" loading={adding} disabled={!parsedVideoId} onClick={handleAdd}>
            Add
          </Button>
        </div>
      </Popover>
    </>
  )
}

function parseYoutubeVideoId(url: string): string | null {
  if (!url) {
    return null
  }
  try {
    const { hostname, pathname, searchParams } = new URL(url)
    if (hostname === 'youtu.be') {
      return pathname.slice(1)
    } else if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
      return searchParams.get('v')
    }
    return null
  } catch {
    return null
  }
}

function VideoList({ videos, onDelete }: { videos: YoutubeVideo[], onDelete: (id: string) => void | Promise<void> }) {
  if (videos.length === 0) {
    return <p>No videos added yet.</p>
  }

  return (
    <Cards>
      {videos.map((video) => <VideoCard video={video} onDelete={() => onDelete(video.id)}/>)}
    </Cards>
  )
}

function VideoCard({ video, onDelete }: { video: YoutubeVideo; onDelete: () => void | Promise<void> }) {
  const [deleting, setDeleting] = useState(false)
  const { isLoggedIn } = useAuth()

  return (
    <Card key={video.id} linkTo={`/youtube/${video.id}`}>
      <CardMedia image={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title}/>
      <CardContent
        title={`${video.title}`}
        description={video.description?.replaceAll('\n', ' ') || '<No description>'}
        actions={isLoggedIn ? [
          <IconButton
            onClick={async e => {
              e.preventDefault()
              setDeleting(true)
              try {
                await onDelete()
              } finally {
                setDeleting(false)
              }
            }}
            // @ts-ignore color prop complaining even though it does support it
            color="lightgray"
            loading={deleting}
          >
            <Delete/>
          </IconButton>
        ]: undefined}
        actionsOnEnd
      />
    </Card>
  )
}
