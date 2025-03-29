import { computerChroniclesEpisodes } from './_data/episodes.js'

export function GET() {
  return Response.json(computerChroniclesEpisodes)
}
