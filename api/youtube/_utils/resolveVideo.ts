import {YoutubeVideo} from '../videos.js'

export async function resolveVideos(ids: string[]): Promise<YoutubeVideo[]> {
  const videos: YoutubeVideo[] = []

  await Promise.all(ids.map(async id => {
    try {
      videos.push(await resolveVideo(id))
    } catch (e) {
      console.error(`Could not fetch video details for ID ${id}: ${(e as Error).message}`)
    }
  }))
  return videos;
}

export async function resolveVideo(id: string): Promise<YoutubeVideo> {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&fields=items(id,snippet/title,snippet/description)&key=${process.env.YOUTUBE_API_KEY}`)
  if (!res.ok) {
    throw new Error(`YouTube API error for ID: ${id}`);
  }
  const data = await res.json() as YoutubeVideoResponse
  const item = data.items[0]
  if (!item) {
    throw new Error(`No video found for ID: ${id}`);
  }
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
  }
}

interface YoutubeVideoResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
    };
  }[];
}
