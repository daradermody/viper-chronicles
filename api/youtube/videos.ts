import {createClient} from 'redis';
import {resolveVideos} from './_utils/resolveVideo.js'

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();

const YOUTUBE_VIDEOS_KEY = 'youtubeVideosIds'

export interface YoutubeVideo {
  id: string;
  title: string;
  description?: string;
}

export async function GET(req: Request) {
  const ids = await redis.lRange(YOUTUBE_VIDEOS_KEY, 0, -1)
  return Response.json(await resolveVideos(ids))
}

export async function POST(req: Request) {
  if (req.headers.get('X-Password') !== process.env.LOGIN_PASSWORD) {
    return new Response('You must log in first.', { status: 403 })
  }
  const { id } = await req.json() as { id: string }
  if (!id) {
    return new Response('`id` is required.', { status: 400 })
  }
  await redis.lPush(YOUTUBE_VIDEOS_KEY, id)
  return new Response(null, { status: 200 })
}

export async function DELETE(req: Request) {
  if (req.headers.get('X-Password') !== process.env.LOGIN_PASSWORD) {
    return new Response('You must log in first.', { status: 403 })
  }
  const { id } = await req.json() as { id: string }
  if (!id) {
    return new Response('`id` is required.', { status: 400 })
  }
  await redis.lRem(YOUTUBE_VIDEOS_KEY, 0, id)
  return new Response(null, { status: 200 })
}
