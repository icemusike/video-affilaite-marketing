export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.toString();
  } catch (e) {
    // If it's not a valid URL, try adding https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return sanitizeUrl(`https://${url}`);
    }
    return '';
  }
}
