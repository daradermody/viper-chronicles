import {Button, IconButton, Menu, MenuItem,} from '@mui/material'
import {Link} from 'react-router-dom'
import {Menu as MenuIcon, Search} from '@mui/icons-material'
import {useState} from 'react'
import {useAuth} from '../AuthProvider'
import {SearchModal} from './SearchModal'
import {EpisodeProgress} from './EpisodeProgress'
import {MusicPlayer} from './MusicPlayer'

export function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const {isLoggedIn, LoginButton, LogoutButton} = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)

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

          <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
            <MenuIcon/>
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem className="hide-sm-up" onClick={() => setAnchorEl(null)}>
              <Button variant="text" color="inherit" onClick={() => setShowSearch(true)}>Search</Button>
            </MenuItem>
            <MenuItem className="hide-sm-down" onClick={() => setAnchorEl(null)}>
              <Button variant="text" color="inherit" onClick={() => setShowMusicPlayer(!showMusicPlayer)}>Background music</Button>
            </MenuItem>
            <MenuItem>
              {isLoggedIn ? <LogoutButton/> : <LoginButton/>}
            </MenuItem>
          </Menu>
        </div>

        <SearchModal open={showSearch} onClose={() => setShowSearch(false)}/>
        {showMusicPlayer && <MusicPlayer onClose={() => setShowMusicPlayer(false)}/>}
      </div>
    </div>
  )
}

