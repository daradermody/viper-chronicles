import fs from 'fs'
import path from 'path'

export function GET(req: Request) {
  const type = new URL(req.url).searchParams.get('type') as string
  const soundsPath = path.join(process.cwd(), 'api', 'soundboard', '_sounds', type)

  try {
    const files = fs.readdirSync(soundsPath)

    if (files.length === 0) {
      return Response.json({error: 'No sound files found'}, {status: 404})
    }

    const randomFile = files[Math.floor(Math.random() * files.length)]
    const filePath = path.join(soundsPath, randomFile)
    const fileContent = fs.readFileSync(filePath)

    return new Response(fileContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileContent.length.toString()
      }
    })
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Error reading sound files'}, {status: 500})
  }
}
