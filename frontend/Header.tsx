import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Menu,
  MenuItem, MenuList,
  styled,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Search, Menu as MenuIcon } from '@mui/icons-material'
import { useMemo, useState } from 'react'
import { Episode } from '../types'
import { useData } from './data/DataProvider'
import { Card, CardContent, CardMedia, getThumbnail } from './cards/Cards'
import { useAuth } from './AuthProvider'

export function Header() {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div style={{ backgroundColor: '#ebeaea', width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1700px',
        width: 'calc(100vw - 40px)',
        margin: '20px auto',
        gap: '40px',
      }}>
        <h1 className="logo" style={{  }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>Viper</div>
            <div style={{ marginLeft: '37px' }}>Chronicles</div>
          </Link>
        </h1>

        <HeaderActions onSearchClick={() => setShowSearch(true)} />
        <MenuButton onSearchClick={() => setShowSearch(true)} />
        <SearchModal open={showSearch} onClose={() => setShowSearch(false)}/>
      </div>

    </div>
  )
}

function HeaderActions({onSearchClick}: { onSearchClick: () => void }) {
  const {isLoggedIn, LoginButton, LogoutButton} = useAuth()

  return (
    <div className="hide-sm-down header-info">
      <div className="hide-sm-down" style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px', flexGrow: 1 }}>
        <EpisodeProgress show="computerChronicles"/>
        <EpisodeProgress show="netCafe"/>
      </div>
      <Button
        className="hide-md-down"
        variant="outlined"
        startIcon={<Search/>}
        color="inherit"
        aria-label="search"
        onClick={onSearchClick}
        style={{ flexShrink: 0, color: 'gray', borderColor: '1px solid #000000de' }}
        disableRipple
      >
        Search episodes...
      </Button>
      <IconButton className="hide-md-up" aria-label="search" onClick={onSearchClick}>
        <Search/>
      </IconButton>
      {isLoggedIn ? <LogoutButton/> : <LoginButton/>}
    </div>
  )
}

function MenuButton({ onSearchClick }: { onSearchClick: () => void }) {
  const {isLoggedIn, LoginButton, LogoutButton} = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div className="hide-sm-up">
      <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
        <MenuIcon/>
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Button variant="text" color="inherit" onClick={onSearchClick}>Search</Button>
        </MenuItem>
        <MenuItem>
          {isLoggedIn ? <LogoutButton/> : <LoginButton/>}
        </MenuItem>
      </Menu>
    </div>
  )
}

function EpisodeProgress({ show }: { show: 'computerChronicles' | 'netCafe' }) {
  const episodeData = useData()
  const { episodes, watched } = episodeData[show]

  const percent = Math.floor(watched.length / episodes.length * 100)
  return (
    <div className="hide-sm-down" style={{ position: 'relative' }}>
      <ThickLinearProgress variant="determinate" value={percent}/>
      <span style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center' }}>{watched.length} / {episodes.length} ({percent}%)</span>
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
  const episodeData = useData()
  const episodes = [
    ...episodeData.computerChronicles.episodes.map(episode => ({ ...episode, show: 'computerChronicles' })),
    ...episodeData.netCafe.episodes.map(episode => ({ ...episode, show: 'netCafe' }))
  ]

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
      <DialogContent
        sx={{ p: 0, maxHeight: 'calc(88vh - 61px)' }}
        onClick={() => {
          onClose()
          setQuery('')
        }}
      >
        {searchedEpisodes?.map(episode => (
          <Card key={episode.id} linkTo={`/${episode.show}/season/${episode.season}/episode/${episode.episode}`} style={{ height: '120px' }}>
            <CardMedia className="hide-sm-down" image={getThumbnail(episode)} alt={`Episode ${episode.episode}`} style={{ width: '162px', flexShrink: 0 }}/>
            <CardContent
              title={`S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}. ${episode.title}`}
              subtitle={episode.show === 'computerChronicles' ? 'Computer Chronicles' : 'Net Cafe'}
              description={episode.description || '<No description>'}
            />
          </Card>
        ))}
      </DialogContent>
    </PositionedDialog>
  )
}

function searchEpisodes<T extends Episode>(query: string, episodes?: T[]): undefined | (T & { _score: number })[] {
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
