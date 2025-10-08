import { Close, GitHub, Language, RateReview, YouTube, Cloud } from '@mui/icons-material'
import { Box, Button, IconButton, Link, Modal, TextField, Typography } from '@mui/material'
import { ReactNode, useState } from 'react'

export function Footer() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  return (
    <div style={{ minHeight: '60px', backgroundColor: 'lightgray', paddingTop: '20px' }}>
      <div style={{ maxWidth: '1700px', display: 'flex', justifyContent: 'center', gap: '4px 30px', margin: '0 auto', padding: '0 20px', flexWrap: 'wrap', color: 'dimgrey' }}>
        <LinkItem label="GitHub" icon={<GitHub/>} href="https://github.com/daradermody/viper-chronicles"/>
        <LinkItem label="Francis Higgins" icon={<YouTube/>} href="https://www.youtube.com/@FrancisHiggins"/>
        <LinkItem label="Chronstracker5000" icon={<Language/>} href="https://chronstracker5000.netlify.app/"/>
        <LinkItem label="Feedback" icon={<RateReview/>} onClick={() => setShowFeedbackForm(true)}/>
        <LinkItem label="GooseCloud" icon={<Cloud/>} href="https://goose-cloud.vercel.app/"/>
      </div>
      <FeedbackForm open={showFeedbackForm} onClose={() => setShowFeedbackForm(false)}/>
    </div>
  )
}

function LinkItem({ label, icon, href, onClick }: { label: string; icon: ReactNode, href?: string, onClick?: () => void }) {
  return (
    <Link
      href={href}
      color="inherit"
      target="_blank"
      onClick={onClick}
      rel="noopener noreferrer"
      style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}
    >
      {icon} {label}
    </Link>
  )
}

function FeedbackForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function sendFeedback() {
    setIsSending(true)
    try {
      await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ message }) })
    } finally {
      setIsSending(false)
      onClose()
      setMessage('')
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxWidth: '80vw',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
          <Close/>
        </IconButton>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Bugs reports, feature requests, life advice, reptilious raps
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Submit feedback to make the website better! Your message is not sent to Francis Higgins or any of his relatives.
        </Typography>
        <TextField value={message} onChange={e => setMessage(e.target.value)} multiline rows={6} fullWidth/>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button onClick={onClose} disabled={isSending}>Cancel</Button>
          <Button variant="contained" onClick={sendFeedback} disabled={!message} loading={isSending}>Send</Button>
        </div>
      </Box>
    </Modal>
  )
}
