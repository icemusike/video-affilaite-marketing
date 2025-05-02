type VideoProvider = 'youtube' | 'vimeo' | 'unknown';

export function getVideoProvider(url: string): VideoProvider {
  if (!url) return 'unknown';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  return 'unknown';
}

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URL(url).searchParams;
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
  }
  
  if (!videoId) return '';
  
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getVimeoEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Extract video ID from Vimeo URL
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(vimeoRegex);
  const videoId = match ? match[1] : '';
  
  if (!videoId) return '';
  
  return `https://player.vimeo.com/video/${videoId}`;
}

export function getEmbedUrl(url: string): string {
  const provider = getVideoProvider(url);
  
  switch (provider) {
    case 'youtube':
      return getYouTubeEmbedUrl(url);
    case 'vimeo':
      return getVimeoEmbedUrl(url);
    default:
      return '';
  }
}

export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return getVideoProvider(url) !== 'unknown';
  } catch (e) {
    return false;
  }
}
