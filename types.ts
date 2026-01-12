
export interface Song {
  title: string;
  artist: string;
  category: 'K-POP' | 'GLOBAL';
  reason: string;
  youtubeUrl: string;
}

export interface RecommendationResponse {
  date: string;
  theme: string;
  songs: Song[];
}
