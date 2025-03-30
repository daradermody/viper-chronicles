import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { Button, IconButton, Popover, TextField, Typography } from '@mui/material'
import { ArrowCircleRightOutlined } from '@mui/icons-material'

interface AuthContextData {
  isLoggedIn: boolean;
  password?: string;
  isLoggingIn: boolean;
  LoginButton: () => ReactNode;
  LogoutButton: () => ReactNode;
}

const AuthContext = createContext<AuthContextData>({
  isLoggedIn: false,
  password: undefined,
  isLoggingIn: false,
  LoginButton: () => null,
  LogoutButton: () => null
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState<string | undefined>()
  const [isCheckingSavedCredentials, setIsCheckingSavedCredentials] = useState(() => !!localStorage.getItem('login_password'))
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    const savedPassword = localStorage.getItem('login_password')
    if (savedPassword) {
      handleLogin(savedPassword)
        .finally(() => setIsCheckingSavedCredentials(false))
    }
  }, [])

  async function handleLogin(password: string) {
    try {
      setIsLoggingIn(true)
      const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password }) })
      if (response.ok) {
        setPassword(password)
        localStorage.setItem('login_password', password)
      } else {
        throw new Error('Invalid password')
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  function handleLogout() {
    setPassword(undefined)
    localStorage.removeItem('login_password')
  }

  const TheLoginButton = useMemo(
    () => () => <LoginButton isCheckingSavedCredentials={isCheckingSavedCredentials} onSubmit={handleLogin}/>,
    [isCheckingSavedCredentials]
  )
  const TheLogoutButton = useMemo(
    () => () => <Button onClick={handleLogout} variant="text" color="inherit">Logout</Button>,
    [isCheckingSavedCredentials]
  )

  return (
    <AuthContext value={{
      isLoggedIn: !!password,
      password,
      isLoggingIn,
      LoginButton: TheLoginButton,
      LogoutButton: TheLogoutButton
    }}>
      {children}
    </AuthContext>
  )
}

function LoginButton({ isCheckingSavedCredentials, onSubmit }: { isCheckingSavedCredentials?: boolean; onSubmit: (password: string) => Promise<void> }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [invalidLogin, setInvalidLogin] = useState(false)

  async function handleLogin(password: string) {
    setInvalidLogin(false)
    setIsLoggingIn(true)
    try {
      await onSubmit(password)
      setAnchorEl(null)
    } catch (e) {
      console.error(e)
      setInvalidLogin(true)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <>
      <Button variant="text" onClick={e => setAnchorEl(e.currentTarget)} disableRipple loading={isCheckingSavedCredentials}>
        Login
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onFocus={() => document.getElementById('password-field')?.focus()}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '24px' }}>
            <TextField
              id="password-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ paddingTop: '2px' }}
              disabled={isLoggingIn}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && password) {
                  void handleLogin(password)
                }
              }}
            />
            <Typography
              variant="caption"
              color="red"
              style={{ marginTop: '4px', visibility: invalidLogin ? 'visible' : 'hidden', textAlign: 'center' }}
            >
              Invalid password
            </Typography>
          </div>
          <IconButton size="large" aria-label="login" onClick={() => handleLogin(password)} disabled={!password} loading={isLoggingIn}>
            <ArrowCircleRightOutlined fontSize="large"/>
          </IconButton>
        </div>
      </Popover>
    </>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
