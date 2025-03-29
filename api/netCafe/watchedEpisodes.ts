import { createClient } from 'redis';

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();

const WATCHED_EPISODES_KEY = 'netCafeWatchedEpisodeIds'

export async function GET(req: Request) {
  return Response.json(await redis.sMembers(WATCHED_EPISODES_KEY))
}

export async function POST(req: Request) {
  const { id, watched } = await req.json() as { id: string, watched: boolean }
  if (watched) {
    await redis.sAdd(WATCHED_EPISODES_KEY, id)
  } else {
    await redis.sRem(WATCHED_EPISODES_KEY, id)
  }
  return new Response(null, { status: 204 })
}
