import { serve } from 'bun'
import index from './frontend/index.html'
import * as episodesRoutes from './api/episodes'
import * as watchedEpisodesRoutes from './api/watchedEpisodes'
import * as loginRoutes from './api/login'


const server = serve({
  routes: {
    '/*': index,
    '/api/episodes': episodesRoutes,
    '/api/watchedEpisodes': watchedEpisodesRoutes,
    '/api/login': loginRoutes
  },
  development: true,
})

console.log(`🚀 Server running at ${server.url}`)
