import { serve } from 'bun'
import index from './frontend/index.html'
import * as computerChroniclesEpisodesRoutes from './api/computerChronicles/episodes'
import * as computerChroniclesWatchedEpisodesRoutes from './api/computerChronicles/watchedEpisodes'
import * as netCafeEpisodesRoutes from './api/netCafe/episodes'
import * as netCafeWatchedEpisodesRoutes from './api/netCafe/watchedEpisodes'
import * as loginRoutes from './api/login'
import * as soundBoardRoutes from './api/soundboard/[type]'

const server = serve({
  routes: {
    '/*': index,
    '/api/computerChronicles/episodes': computerChroniclesEpisodesRoutes,
    '/api/computerChronicles/watchedEpisodes': computerChroniclesWatchedEpisodesRoutes,
    '/api/netCafe/episodes': netCafeEpisodesRoutes,
    '/api/netCafe/watchedEpisodes': netCafeWatchedEpisodesRoutes,
    '/api/login': loginRoutes,
    '/api/soundboard/:type': {
      GET: req => {
        const vercelReq = new Request(req.url + `?type=${req.params.type}`)
        return soundBoardRoutes.GET(vercelReq)
      }
    }
  },
  development: { hmr: false }
})

console.log(`🚀 Server running at ${server.url}`)
