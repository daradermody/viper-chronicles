import { serve } from 'bun'
import index from './frontend/index.html'
import { episodes } from './episodes'

const watchedEpisodes: string[] = []

const server = serve({
  routes: {
    '/*': index,
    '/api/episodes': {
      GET: async () => Response.json(episodes),
    },
    '/api/watchedEpisodes': {
      GET: async () => Response.json(watchedEpisodes),
      POST: async req => {
        const { archiveOrgId, watched } = await req.json()
        console.log(`Setting watched status for ${archiveOrgId} to ${watched}`)
        if (watched) {
          watchedEpisodes.push(archiveOrgId)
        } else {
          const index = watchedEpisodes.indexOf(archiveOrgId)
          if (index > -1) {
            watchedEpisodes.splice(index, 1)
          }
        }
        console.log(watchedEpisodes)
        return new Response(null, { status: 204 })
      },
    }
  },
  development: process.env.NODE_ENV !== 'production',
})

console.log(`🚀 Server running at ${server.url}`)
