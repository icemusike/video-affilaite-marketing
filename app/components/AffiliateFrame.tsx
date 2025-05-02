import { sanitizeUrl } from "~/utils/url";

interface AffiliateFrameProps {
  affiliateUrl: string;
  className?: string;
}

export default function AffiliateFrame({ affiliateUrl, className = "" }: AffiliateFrameProps) {
  const sanitizedUrl = sanitizeUrl(affiliateUrl);
  
  if (!sanitizedUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <p className="text-gray-500">Invalid affiliate URL</p>
      </div>
    );
  }
  
  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      <iframe
        src={sanitizedUrl}
        className="w-full border-0 rounded-lg"
        style={{ height: '500px' }}
        title="Affiliate content"
      ></iframe>
    </div>
  );
}
