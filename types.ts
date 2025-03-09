export interface Episode {
  id: string;
  season: number;
  episode: number;
  archiveOrgId?: string;
  youtubeId?: string;
  title: string;
  releaseDate: string;
  description?: string;
  thumbnail?: string;
}

