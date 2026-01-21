import {resolveVideo} from './_utils/resolveVideo.js'

export async function POST(req: Request) {
  const { id } = await req.json() as { id: string }
  if (!id) {
    return new Response('`id` is required.', { status: 400 })
  }
  return Response.json(await resolveVideo(id))
}
