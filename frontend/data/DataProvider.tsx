import {createContext, ReactNode, useCallback, useContext, useMemo} from 'react'
import { Episode } from '../../types'
import { useEpisodes } from './UseEpisodes'
import { useWatchedEpisodes } from './UseWatchedEpisodes'
import {CircularProgress} from "@mui/material";

const DataProviderContext = createContext<Data | undefined>(undefined)

interface Data {
  computerChronicles: {
    episodes: Episode[];
    watched: string[];
    setWatched(episodeId: string, watched: boolean): void;
  };
  netCafe: {
    episodes: Episode[];
    watched: string[];
    setWatched(episodeId: string, watched: boolean): void;
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { episodes: computerChroniclesEpisodes, error: computerChroniclesEpisodesError } = useEpisodes('computerChronicles')
  const { episodes: netCafeEpisodes, error: netCafeEpisodesError } = useEpisodes('netCafe')
  const { watchedEpisodes: computerChroniclesWatchedEpisodes, error: computerChroniclesWatchedError, setWatched: computerChroniclesSetWatched } = useWatchedEpisodes('computerChronicles')
  const { watchedEpisodes: netCafeWatchedEpisodes, error: netCafeEatchedError, setWatched: netCafeSetWatched } = useWatchedEpisodes('netCafe')

  if (computerChroniclesEpisodesError || netCafeEpisodesError || computerChroniclesWatchedError || netCafeEatchedError) {
    return <div>Something went wrong fetching data :(</div>
  }

  if (!computerChroniclesEpisodes || !netCafeEpisodes || !computerChroniclesWatchedEpisodes || !netCafeWatchedEpisodes) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 40px)' }}>
        <CircularProgress size={150} />
      </div>
    )
  }

  return (
    <DataProviderContext
      value={{
        computerChronicles: { episodes: computerChroniclesEpisodes, watched: computerChroniclesWatchedEpisodes, setWatched: computerChroniclesSetWatched },
        netCafe: { episodes: netCafeEpisodes, watched: netCafeWatchedEpisodes, setWatched: netCafeSetWatched }
      }}
    >
      {children}
    </DataProviderContext>
  )
}

export function useData() {
  return useContext(DataProviderContext) as Data
}

export function useEpisode(show: 'computerChronicles' | 'netCafe', season: number, episodeNumber: number): EpisodeInfo | undefined {
  const episodeData = useData()
  const { episodes, watched, setWatched } = episodeData[show]

  const episode = useMemo(() => {
    return episodes.find(ep => ep.season === season && ep.episode === episodeNumber)
  }, [episodeData, show, season, episodeNumber])

  const episodeWatched = useMemo(() => !!episode && watched.includes(episode.id), [watched, episode])

  const setEpisodeWatched = useCallback((isWatched: boolean) => {
    if (episode) {
      setWatched(episode.id, isWatched)
    }
  }, [])

  if (!episode) return undefined

  return {
    episode,
    watched: episodeWatched,
    setWatched: setEpisodeWatched
  }
}

interface EpisodeInfo {
  episode: Episode;
  watched: boolean;
  setWatched(watched: boolean): void;
}