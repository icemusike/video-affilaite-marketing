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

// This function could be used to check if a site is likely to have CSP restrictions
export function mightHaveCspRestrictions(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    // List of domains known to have strict CSP policies
    const restrictedDomains = [
      'jvzoo.com',
      'clickbank.com',
      'warriorplus.com',
      'paypal.com',
      'stripe.com',
      'facebook.com',
      'instagram.com'
    ];
    
    return restrictedDomains.some(domain => 
      parsedUrl.hostname === domain || 
      parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return false;
  }
}
