import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  styled,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Search } from '@mui/icons-material'
import { useMemo, useState } from 'react'
import { Episode } from '../types'
import { useData } from './data/DataProvider'
import { Card, CardContent, CardMedia, getThumbnail } from './cards/Cards'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  return (
    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h2" fontSize="3rem">
        <Link to="/" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          Viper Chronicles
        </Link>
      </Typography>
      <div className="hide-xs-down header-info">
        <EpisodeProgress/>
        <Button
          className="hide-md-down"
          variant="outlined"
          startIcon={<Search/>}
          color="inherit"
          aria-label="search"
          onClick={() => setShowSearch(true)}
          style={{ flexShrink: 0, color: 'gray', borderColor: '1px solid #000000de' }}
          disableRipple
        >
          Search episodes...
        </Button>
        <IconButton className="hide-md-up" aria-label="search" onClick={() => setShowSearch(true)}>
          <Search/>
        </IconButton>
      </div>
      <SearchModal open={showSearch} onClose={() => setShowSearch(false)}/>
    </div>
  )
}

function EpisodeProgress() {
  const {episodes, watchedEpisodes} = useData()

  const percent = Math.floor(watchedEpisodes.length / episodes.length * 100)
  return (
    <div className="hide-sm-down" style={{ width: '300px', position: 'relative' }}>
      <ThickLinearProgress variant="determinate" value={percent}/>
      <span style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center' }}>{watchedEpisodes.length} / {episodes.length} ({percent}%)</span>
    </div>
  )
}

const ThickLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
  backgroundColor: '#0000001c',
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#308d2c'
  },
}));

function SearchModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')
  const {episodes} = useData()

  const searchedEpisodes = useMemo(() => searchEpisodes(query, episodes), [episodes, query])

  return (
    <PositionedDialog open={open} onClose={onClose} scroll="body" onFocus={() => document.getElementById('search-input')?.focus()}>
      <DialogTitle sx={{ p: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid lightgray', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
          <Search sx={{ position: 'absolute' }}/>
          <input
            id="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ border: 'none', height: '60px', flexGrow: 1, fontSize: '20px', outline: 'none', padding: '0 30px', backgroundColor: 'transparent', zIndex: 1 }}
            placeholder="Search episodes..."
            autoFocus
          />
          <button
            onClick={onClose}
            style={{ fontFamily: 'monospace', borderRadius: '6px', border: '1px solid gray', backgroundColor: '#f6f7f8', cursor: 'pointer', position: 'absolute', right: '20px', zIndex: 2 }}
          >
            esc
          </button>
        </div>
      </DialogTitle>
      <DialogContent sx={{ p: 0, maxHeight: 'calc(88vh - 61px)' }} onClick={onClose}>
        {searchedEpisodes?.map(episode => (
          <Card key={episode.id} linkTo={`/season/${episode.season}/episode/${episode.episode}`} style={{ height: '120px' }}>
            <CardMedia className="hide-sm-down" image={getThumbnail(episode)} alt={`Episode ${episode.episode}`} style={{ width: '162px' }}/>
            <CardContent
              title={`S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}. ${episode.title}`}
              subtitle={episode.releaseDate}
              description={episode.description || '<No description>'}
            />
          </Card>
        ))}
      </DialogContent>
    </PositionedDialog>
  )
}

function searchEpisodes(query: string, episodes?: Episode[]): undefined | (Episode & { _score: number })[] {
  if (!episodes) return undefined
  if (!query) return undefined

  return episodes
    .map(episode => ({ ...episode, _score: scoreEpisode(episode, query) }))
    .filter(episode => !!episode._score)
    .sort((epA, epB) => epB._score - epA._score)
    .slice(0, 10)
}

function scoreEpisode(episode: Episode, query: string): number {
  const lowerEpisodeNumber = `s${episode.season.toString().padStart(2, '0')}e${episode.episode.toString().padStart(2, '0')}`
  const lowerTitle = episode.title.toLowerCase()
  const lowerDescription = episode.description?.toLowerCase() || ''
  const lowerReleaseDate = episode.releaseDate.toLowerCase()
  let score = 0;
  for (const word of query.split(/\s+/)) {
    const lowerWord = word.toLowerCase();

    const episodeNumberScore = lowerEpisodeNumber.includes(lowerWord) ? 50 : 0
    const titleScore = lowerTitle.includes(lowerWord) ? 10 : 0
    const releaseDateScore = lowerReleaseDate.toLowerCase().includes(lowerWord) ? 5 : 0
    const descriptionScore = lowerDescription.includes(lowerWord) ? 1 : 0

    score += episodeNumberScore + titleScore + releaseDateScore + descriptionScore
  }
  return score
}

const PositionedDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    top: '6vh',
  },
  '& .MuiDialog-container': {
    backdropFilter: 'blur(2px)'
  }
}));
