import { createClient } from 'redis';

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();

export async function GET(req: Request) {
  const show = new URL(req.url).searchParams.get('show') as string
  const episode = new URL(req.url).searchParams.get('episode') as string
  return Response.json(JSON.parse(await redis.hGet(`timestamp:${show}`, episode) || '{}'))
}

export async function POST(req: Request) {
  if (req.headers.get('X-Password') !== process.env.LOGIN_PASSWORD) {
    return new Response('You must log in first.', { status: 403 })
  }
  const episodeTimestamps = await req.json() as Timestamps
  const show = new URL(req.url).searchParams.get('show') as string
  const episode = new URL(req.url).searchParams.get('episode') as string

  await redis.hSet(`timestamp:${show}`, episode, JSON.stringify(episodeTimestamps))
  return new Response(null, { status: 204 })
}

interface Timestamps {
  [key: string]: {
    time: number;
    name?: string;
  }
}