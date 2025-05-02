import { sanitizeUrl } from "~/utils/url";

interface BonusLinkProps {
  bonusUrl?: string;
  className?: string;
}

export default function BonusLink({ bonusUrl, className = "" }: BonusLinkProps) {
  if (!bonusUrl) return null;
  
  const sanitizedUrl = sanitizeUrl(bonusUrl);
  
  if (!sanitizedUrl) return null;
  
  return (
    <div className={`mt-6 ${className}`}>
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Special Bonus Offer!</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                We've prepared a special bonus for you. Click the button below to access it!
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <a
                  href={sanitizedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 transition-colors"
                >
                  Access Bonus
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
