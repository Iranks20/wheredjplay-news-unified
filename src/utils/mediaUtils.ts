/**
 * Media utilities for handling embedded media in the frontend
 */

/**
 * Extract Spotify track ID from various Spotify URL formats
 */
export function extractSpotifyTrackId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /spotify\.com\/embed\/track\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extract SoundCloud track path from URL
 */
export function extractSoundCloudTrackPath(url: string): string | null {
  if (!url) return null;

  // Handle various SoundCloud URL formats
  const patterns = [
    /soundcloud\.com\/([^\/\?]+)\/([^\/\?]+)/,  // artist/track format like "forss/flickermood"
    /soundcloud\.com\/([^\/\?]+)/                 // just artist format
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const result = match[0].replace('https://', '').replace('http://', '');

      return result;
    }
  }
  
  // Try alternative approach - extract just the path part
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('soundcloud.com')) {
      const path = urlObj.pathname;

      return path.substring(1); // Remove leading slash
    }
  } catch (error) {

  }

  return null;
}

/**
 * Extract Beatport track ID from URL
 */
export function extractBeatportTrackId(url: string): string | null {
  if (!url) return null;

  // Handle various Beatport URL formats
  const patterns = [
    /beatport\.com\/track\/([^\/\?]+)\/(\d+)/,  // track-name/id format
    /beatport\.com\/track\/(\d+)/,               // just id format
    /beatport\.com\/.*\/track\/(\d+)/            // any path with track id
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const trackId = match[match.length - 1]; // Get the last match (track ID)

      return trackId;
    }
  }
  
  // Try alternative approach - extract from URL path
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('beatport.com')) {
      const pathParts = urlObj.pathname.split('/');
      const trackIndex = pathParts.findIndex(part => part === 'track');
      if (trackIndex !== -1 && pathParts[trackIndex + 1]) {
        const trackId = pathParts[trackIndex + 1];

        return trackId;
      }
    }
  } catch (error) {

  }

  return null;
}

/**
 * Detect media type from URL
 */
export function detectMediaType(url: string): 'image' | 'spotify' | 'youtube' | 'soundcloud' | 'beatport' | null {
  if (!url) return null;
  
  if (url.includes('spotify.com') || url.includes('open.spotify.com')) {
    return 'spotify';
  }
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (url.includes('soundcloud.com')) {
    return 'soundcloud';
  }
  
  if (url.includes('beatport.com')) {
    return 'beatport';
  }
  
  // Check if it's an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();
  if (imageExtensions.some(ext => lowerUrl.includes(ext)) || lowerUrl.includes('data:image/')) {
    return 'image';
  }
  
  return null;
}

/**
 * Generate embedded media HTML
 */
export function generateEmbedHtml(url: string, mediaType: string): string {
  switch (mediaType) {
    case 'spotify': {
      const trackId = extractSpotifyTrackId(url);
      if (!trackId) return '';
      
      return `<iframe 
        style="border-radius: 12px" 
        src="https://open.spotify.com/embed/track/${trackId}" 
        width="100%" 
        height="352" 
        frameborder="0" 
        allowfullscreen 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy">
      </iframe>`;
    }
    
    case 'youtube': {
      const videoId = extractYouTubeVideoId(url);
      if (!videoId) return '';
      
      return `<iframe 
        width="100%" 
        height="315" 
        src="https://www.youtube.com/embed/${videoId}" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>`;
    }
    
    case 'soundcloud': {
      const trackPath = extractSoundCloudTrackPath(url);
      if (!trackPath) return '';
      
      return `<iframe 
        width="100%" 
        height="166" 
        scrolling="no" 
        frameborder="no" 
        allow="autoplay" 
        src="https://w.soundcloud.com/player/?url=https://soundcloud.com/${trackPath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&buying=false&liking=false&download=false&sharing=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0">
      </iframe>`;
    }
    
    case 'beatport': {
      const trackId = extractBeatportTrackId(url);
      if (!trackId) return '';
      
      return `<iframe 
        width="100%" 
        height="166" 
        scrolling="no" 
        frameborder="no" 
        allow="autoplay" 
        src="https://embed.beatport.com/track/${trackId}?color=ff5500&bgcolor=000000&autoplay=false&show_artwork=true&show_playcount=true&show_user=true&hide_related=false&visual=true&start_track=0">
      </iframe>`;
    }
    
    default:
      return '';
  }
}

/**
 * Validate media URL
 */
export function validateMediaUrl(url: string, mediaType: string): { isValid: boolean; error?: string } {
  if (!url.trim()) {
    return { isValid: false, error: 'URL is required' };
  }
  
  try {
    new URL(url);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
  
  switch (mediaType) {
    case 'spotify': {
      const trackId = extractSpotifyTrackId(url);
      if (!trackId) {
        return { isValid: false, error: 'Invalid Spotify URL. Please use a track URL like https://open.spotify.com/track/...' };
      }
      break;
    }
    
    case 'youtube': {
      const videoId = extractYouTubeVideoId(url);
      if (!videoId) {
        return { isValid: false, error: 'Invalid YouTube URL. Please use a video URL like https://www.youtube.com/watch?v=...' };
      }
      break;
    }
    
    case 'soundcloud': {
      const trackPath = extractSoundCloudTrackPath(url);
      if (!trackPath) {
        return { isValid: false, error: 'Invalid SoundCloud URL. Please use a track URL like https://soundcloud.com/artist/track-name' };
      }
      break;
    }
    
    case 'beatport': {
      const trackId = extractBeatportTrackId(url);
      if (!trackId) {
        return { isValid: false, error: 'Invalid Beatport URL. Please use a track URL like https://www.beatport.com/track/track-name/id' };
      }
      break;
    }
  }
  
  return { isValid: true };
}
