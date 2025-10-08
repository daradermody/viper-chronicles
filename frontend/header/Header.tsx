import { Badge, Button, IconButton, Menu, MenuItem as MuiMenuItem } from '@mui/material'
import {Link} from 'react-router-dom'
import {Menu as MenuIcon, Search} from '@mui/icons-material'
import { ReactNode, useMemo, useState } from 'react'
import {useAuth} from '../AuthProvider'
import {SearchModal} from './SearchModal'
import {EpisodeProgress} from './EpisodeProgress'
import {MusicPlayer} from './MusicPlayer'
import {Soundboard} from './Soundboard'
import { LATEST_VERSION, WebsiteUpdates } from './website_updates/WebsiteUpdates'

export function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const {isLoggedIn, LoginButton, LogoutButton} = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showSoundboard, setShowSoundboard] = useState(false)
  const [showUpdates, setShowUpdates] = useState(false)

  const storedLastSeenVersion = useMemo(() => localStorage.getItem('lastSeenVersion') || '0', [])
  const [lastSeenVersion, setLastSeenVersion] = useState(storedLastSeenVersion)
  const showUpdatesBadge = lastSeenVersion !== `${LATEST_VERSION}`

  function handleShowUpdatesClick() {
    setShowUpdates(true)
    localStorage.setItem('lastSeenVersion', `${LATEST_VERSION}`)
    setLastSeenVersion(`${LATEST_VERSION}`)
  }

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

        <div className="header-info">
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
            onClick={() => setShowSearch(true)}
            style={{ flexShrink: 0, color: 'gray', borderColor: '1px solid #000000de' }}
            disableRipple
          >
            Search episodes...
          </Button>

          <IconButton className="hide-md-up hide-sm-down" aria-label="search" onClick={() => setShowSearch(true)}>
            <Search/>
          </IconButton>

          <Badge variant="dot" color="secondary" invisible={!showUpdatesBadge} slotProps={{ badge: { style: { top: '10px', right: '4px' } } }}>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
              <MenuIcon/>
            </IconButton>
          </Badge>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClick={() => setAnchorEl(null)} onClose={() => setAnchorEl(null)}>
            <MenuItem className="hide-sm-up" onClick={() => setShowSearch(true)}>Search</MenuItem>
            <MenuItem onClick={() => setShowMusicPlayer(!showMusicPlayer)}>Background music</MenuItem>
            <MenuItem onClick={() => setShowSoundboard(!showSoundboard)}>Soundboard</MenuItem>
            <MenuItem onClick={handleShowUpdatesClick}>
              <Badge variant="dot" color="secondary" invisible={!showUpdatesBadge} slotProps={{ badge: { style: { top: '4px', right: '-6px' } } }}>
                What's new
              </Badge>
            </MenuItem>
            <MuiMenuItem style={{ padding: 0 }}>
              {isLoggedIn ? <LogoutButton/> : <LoginButton/>}
            </MuiMenuItem>
          </Menu>
        </div>

        <SearchModal open={showSearch} onClose={() => setShowSearch(false)}/>
        {showSoundboard && <Soundboard onClose={() => setShowSoundboard(false)}/>}
        {showMusicPlayer && <MusicPlayer onClose={() => setShowMusicPlayer(false)}/>}
        {showUpdates && <WebsiteUpdates onClose={() => setShowUpdates(false)}/>}
      </div>
    </div>
  )
}

function MenuItem({ children, className, onClick }: { children: ReactNode; className?: string; onClick: () => void }) {
  return (
    <MuiMenuItem className={className} style={{ padding: 0 }}>
      <Button variant="text" color="inherit" onClick={onClick} style={{ width: '100%', justifyContent: 'start', padding: '8px 16px' }}>
        {children}
      </Button>
    </MuiMenuItem>
  )
}
