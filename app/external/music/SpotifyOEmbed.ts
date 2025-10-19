export interface SpotifyEmbedData {
  html: string;
  width: number;
  height: number;
  title: string;
  author_name: string;
  thumbnail_url: string;
}

export async function getSpotifyEmbed(trackUrl: string): Promise<SpotifyEmbedData | null> {
  try {
    const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`);

    if (!response.ok) {
      throw new Error(`Spotify oEmbed API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as SpotifyEmbedData;
    return {
      html: data.html,
      width: data.width,
      height: data.height,
      title: data.title,
      author_name: data.author_name,
      thumbnail_url: data.thumbnail_url,
    };
  } catch (error) {
    console.error(`Failed to fetch Spotify embed: ${error}`);
    return null;
  }
}

export function buildSpotifyTrackUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`;
}
