import { useState, useEffect } from "react";
import { sanitizeUrl } from "~/utils/url";

interface ProxyAffiliateFrameProps {
  affiliateUrl: string;
  className?: string;
}

// This is an alternative approach that could be implemented with a backend proxy
// Note: This would require server-side implementation to work properly
export default function ProxyAffiliateFrame({ affiliateUrl, className = "" }: ProxyAffiliateFrameProps) {
  const sanitizedUrl = sanitizeUrl(affiliateUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  if (!sanitizedUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <p className="text-gray-500">Invalid affiliate URL</p>
      </div>
    );
  }
  
  return (
    <div className={`w-full overflow-hidden rounded-lg ${className}`}>
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-gray-600">
            Click the button below to access the affiliate offer.
          </p>
        </div>
        
        <div className="flex justify-center">
          <a
            href={sanitizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition-colors text-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Access Offer Now
          </a>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This will open the affiliate page in a new tab</p>
        </div>
      </div>
    </div>
  );
}
