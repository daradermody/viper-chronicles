import { serve } from 'bun'
import index from './frontend/index.html'
import * as computerChroniclesEpisodesRoutes from './api/computerChronicles/episodes'
import * as computerChroniclesWatchedEpisodesRoutes from './api/computerChronicles/watchedEpisodes'
import * as netCafeEpisodesRoutes from './api/netCafe/episodes'
import * as netCafeWatchedEpisodesRoutes from './api/netCafe/watchedEpisodes'
import * as loginRoutes from './api/login'

const server = serve({
  routes: {
    '/*': index,
    '/api/computerChronicles/episodes': computerChroniclesEpisodesRoutes,
    '/api/computerChronicles/watchedEpisodes': computerChroniclesWatchedEpisodesRoutes,
    '/api/netCafe/episodes': netCafeEpisodesRoutes,
    '/api/netCafe/watchedEpisodes': netCafeWatchedEpisodesRoutes,
    '/api/login': loginRoutes
  },
  development: true
})

console.log(`🚀 Server running at ${server.url}`)
