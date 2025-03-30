import { GitHub, Language, YouTube } from '@mui/icons-material'
import { Link } from '@mui/material'
import { ReactNode } from 'react'

export function Footer() {
  return (
    <div style={{ minHeight: '60px', backgroundColor: 'lightgray', paddingTop: '10px' }}>
      <div style={{ maxWidth: '1700px', display: 'flex', justifyContent: 'center', gap: '4px 30px', margin: '0 auto', padding: '0 20px', flexWrap: 'wrap' }}>
        <LinkItem label="GitHub" icon={<GitHub/>} href="https://github.com/daradermody/viper-chronicles"/>
        <LinkItem label="Francis Higgins" icon={<YouTube/>} href="https://www.youtube.com/@FrancisHiggins"/>
        <LinkItem label="Chronstracker5000" icon={<Language/>} href="https://chronstracker5000.netlify.app/"/>
      </div>
    </div>
  )
}

function LinkItem({ label, href, icon }: { label: string; href: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      color="inherit"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex', gap: '4px' }}
    >
      {icon} {label}
    </Link>
  )

}
