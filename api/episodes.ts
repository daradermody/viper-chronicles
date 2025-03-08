import { episodes } from './_data/episodes.js'

export function GET() {
  return Response.json(episodes)
}
