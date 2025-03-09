import { ReactNode, useEffect, useState } from 'react'
import { IconButton, TextField, Typography } from '@mui/material'
import { ArrowCircleRightOutlined } from '@mui/icons-material'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState<string>('')
  const [isAllowed, setIsAllowed] = useState(false)
  const [invalidLogin, setInvalidLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedPassword = localStorage.getItem('login_password')
    if (savedPassword) {
      handleLogin(savedPassword).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  async function handleLogin(password: string) {
    const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password }) })
    if (response.ok) {
      localStorage.setItem('login_password', password)
      setInvalidLogin(false)
      setIsAllowed(true)
    } else {
      setInvalidLogin(true)
    }
  }

  if (isLoading) return null

  if (isAllowed) {
    return (
      <div>
        {children}
      </div>
    )
  } else {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 40px)',
        flexDirection: 'column',
      }}
      >
        <Typography variant="h3" style={{ marginBottom: '40px' }}>Only shlugs allowed</Typography>

        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ paddingTop: '2px' }}
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
          <IconButton size="large" aria-label="login" onClick={() => handleLogin(password)}>
            <ArrowCircleRightOutlined fontSize="large"/>
          </IconButton>
        </div>
      </div>
    )
  }
}
