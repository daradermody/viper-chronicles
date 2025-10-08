import { ReactNode } from 'react'
import { Box, Card, CardContent, IconButton, Modal, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import backgroundMusicSoundboard from './background_music_soundboard.png'
import nameTimestamps from './name_timestamps.png'

export const LATEST_VERSION = 2

export function WebsiteUpdates({ onClose }: { onClose: () => void }) {
  return (
    <Modal open onClose={onClose}>
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
          What's new?
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '80vh' }}>
          <Update title="Named timestamps">
            Video timestamps can now have names so you can keep track of your many samples.
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }} >
              <img src={nameTimestamps} alt="named timestamps"/>
            </div>
          </Update>

          <Update title="What's new with you?">
            A "What's new" log has been added so it's easier to find out what new features have been added since your last visit. You're looking right at it!
          </Update>

          <Update title="Better volume control">
            The volume and volume control of background music and the soundboard are now more consistent.
          </Update>

          <Update title="Sound quality gifts">
            Background music and soundboards added! Check out the top-right menu.
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <img src={backgroundMusicSoundboard} alt="background music and soundboard"/>
            </div>
          </Update>
        </div>
      </Box>
    </Modal>
  )
}

function Update({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card sx={{ minWidth: 275, flexShrink: 0 }} variant="outlined">
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}
