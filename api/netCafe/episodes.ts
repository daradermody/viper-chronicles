import { netCafeEpisodes } from './_data/episodes.js'

export function GET() {
  return Response.json(netCafeEpisodes, { headers: { 'Cache-Control': 'public, max-age=604800000000' } })
}
