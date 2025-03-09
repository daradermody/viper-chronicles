import { createContext, ReactNode, useContext } from 'react'
import { Episode } from '../../types'
import { useEpisodes } from './UseEpisodes'
import { useWatchedEpisodes } from './UseWatchedEpisodes'
import {CircularProgress} from "@mui/material";

const DataProviderContext = createContext<Data | undefined>(undefined)

interface Data {
  episodes: Episode[];
  watchedEpisodes: string[];
  setWatched(episodeId: string, watched: boolean): void;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { episodes, error: episodesError } = useEpisodes()
  const { watchedEpisodes, error: watchedError, setWatched } = useWatchedEpisodes()

  if (episodesError || watchedError) {
    return <div>Something went wrong fetching data :(</div>
  }

  if (!watchedEpisodes || !episodes) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 40px)' }}>
        <CircularProgress size={150} />
      </div>
    )
  }

  return (
    <DataProviderContext value={{ episodes, watchedEpisodes, setWatched }}>
      {children}
    </DataProviderContext>
  )
}

export function useData() {
  return useContext(DataProviderContext) as Data
}
