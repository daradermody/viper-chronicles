import { computerChroniclesEpisodes } from './_data/episodes.js'

export function GET() {
  return Response.json(computerChroniclesEpisodes, { headers: { 'Cache-Control': 'public, max-age=604800000000' } })
}
