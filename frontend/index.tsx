import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material'
import 'keyboard-css'

import './index.css'
import Home from './pages/Home'
import EpisodeList from './pages/EpisodeList'
import EpisodeInfo from './pages/EpisodeInfo'
import ComputerChroniclesSeasonList from './pages/ComputerChroniclesSeasonList'
import NetCafeSeasonList from './pages/NetCafeSeasonList'
import { DataProvider } from './data/DataProvider'
import { AuthProvider } from './AuthProvider'

const elem = document.getElementById('root')!
const app = (
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/computerChronicles" element={<ComputerChroniclesSeasonList/>}/>
                <Route path="/netCafe" element={<NetCafeSeasonList/>}/>
                <Route path="/:show/season/:season" element={<EpisodeList/>}/>
                <Route path="/:show/season/:season/episode/:episode" element={<EpisodeInfo/>}/>
              </Routes>
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </StyledEngineProvider>
  </StrictMode>
)

if ((import.meta as any).hot) {
  const root = ((import.meta as any).hot.data.root ??= createRoot(elem))
  root.render(app)
} else {
  createRoot(elem).render(app)
}
