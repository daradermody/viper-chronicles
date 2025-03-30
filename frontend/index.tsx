import { createRoot } from 'react-dom/client'
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
import { Header } from './Header'
import { Footer } from './Footer'

const elem = document.getElementById('root')!
const app = (
  <StyledEngineProvider injectFirst>
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header/>
            <div className="content">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/computerChronicles" element={<ComputerChroniclesSeasonList/>}/>
                <Route path="/netCafe" element={<NetCafeSeasonList/>}/>
                <Route path="/:show/season/:season" element={<EpisodeList/>}/>
                <Route path="/:show/season/:season/episode/:episode" element={<EpisodeInfo/>}/>
              </Routes>
            </div>
            <Footer/>
          </div>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  </StyledEngineProvider>
)

createRoot(elem).render(app)
