import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import AffiliateFrame from "~/components/AffiliateFrame";
import BonusLink from "~/components/BonusLink";
import Header from "~/components/Header";
import VideoEmbed from "~/components/VideoEmbed";
import { getCampaign } from "~/models/campaign.server";
import { sanitizeUrl } from "~/utils/url";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const campaignId = params.campaignId;
  
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const campaign = await getCampaign(campaignId);
  
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  
  // Get URL parameters for personalization
  const url = new URL(request.url);
  const nameParam = url.searchParams.get('name') || 'Preview User';
  
  return json({ campaign, nameParam });
}

export default function CampaignPreview() {
  const { campaign, nameParam } = useLoaderData<typeof loader>();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hasWatched, setHasWatched] = useState(false);
  
  // Personalize the campaign name by replacing {name} with the name parameter
  const personalizedName = campaign.name.replace(/{name}/g, nameParam);
  
  const handleVideoComplete = () => {
    setShowRedirectMessage(true);
    setHasWatched(true);
    
    // Start countdown
    setCountdown(5);
    
    // Redirect to affiliate URL after countdown
    const sanitizedUrl = sanitizeUrl(campaign.affiliateUrl);
    if (sanitizedUrl) {
      const timer = setTimeout(() => {
        window.open(sanitizedUrl, '_blank', 'noopener,noreferrer');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Handle countdown
  useEffect(() => {
    if (showRedirectMessage && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showRedirectMessage, countdown]);
  
  // Generate example personalized URL for sharing
  const baseUrl = window.location.origin;
  const personalizedUrl = `${baseUrl}/c/${campaign.id}?name=John`;
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Preview: {campaign.name}</h1>
              <p className="mt-2 text-sm text-gray-700">
                This is how your campaign will look to visitors
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Link
                to={`/admin/campaigns/${campaign.id}`}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </Link>
              <Link
                to={`/c/${campaign.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Live
              </Link>
            </div>
          </div>
          
          {/* Personalization Info */}
          {campaign.name.includes('{name}') && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800">Personalization Available</h3>
              <p className="mt-2 text-sm text-yellow-700">
                This campaign includes personalization. Share the URL with a name parameter to personalize the headline.
              </p>
              <div className="mt-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-yellow-800 mr-2">Example URL:</span>
                  <code className="text-sm bg-yellow-100 px-2 py-1 rounded">{personalizedUrl}</code>
                </div>
              </div>
            </div>
          )}
          
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="p-6">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">{personalizedName}</h2>
              
              <div className="mb-8">
                <VideoEmbed 
                  videoUrl={campaign.videoUrl} 
                  className="aspect-video" 
                  onVideoComplete={handleVideoComplete}
                />
              </div>
              
              {showRedirectMessage ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center animate-pulse">
                  <p className="text-blue-700 font-medium">
                    Thanks for watching! You'll be redirected to the offer page in {countdown} seconds...
                  </p>
                  <button 
                    onClick={() => {
                      window.open(sanitizeUrl(campaign.affiliateUrl), '_blank', 'noopener,noreferrer');
                    }}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go now
                  </button>
                </div>
              ) : hasWatched ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                  <p className="text-green-700">
                    You've completed watching the video! Check out the offer below.
                  </p>
                </div>
              ) : null}
              
              <div>
                <AffiliateFrame affiliateUrl={campaign.affiliateUrl} />
              </div>
              
              {/* Display Bonus Link if available */}
              <BonusLink bonusUrl={campaign.bonusUrl} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
