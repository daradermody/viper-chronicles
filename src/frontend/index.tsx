import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'
import Home from './pages/Home'
import SeasonInfo from './pages/SeasonInfo'
import EpisodeInfo from './pages/EpisodeInfo'
import { DataProvider } from './data/DataProvider'

const elem = document.getElementById('root')!
const app = (
  <StrictMode>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/season/:season" element={<SeasonInfo/>}/>
          <Route path="/season/:season/episode/:episode" element={<EpisodeInfo/>}/>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  </StrictMode>
)

if ((import.meta as any).hot) {
  const root = ((import.meta as any).hot.data.root ??= createRoot(elem))
  root.render(app)
} else {
  createRoot(elem).render(app)
}
