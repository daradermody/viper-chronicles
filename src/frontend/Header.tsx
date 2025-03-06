import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography variant="h2">
        <Link to="/" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          Viper Chronicles
        </Link>
      </Typography>
    </div>
  )
}
