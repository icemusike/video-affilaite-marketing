import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import AffiliateFrame from "~/components/AffiliateFrame";
import Header from "~/components/Header";
import VideoEmbed from "~/components/VideoEmbed";
import { getCampaign } from "~/models/campaign.server";
import { sanitizeUrl } from "~/utils/url";

export async function loader({ params }: LoaderFunctionArgs) {
  const campaignId = params.campaignId;
  
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const campaign = await getCampaign(campaignId);
  
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return json({ campaign });
}

export default function CampaignPreview() {
  const { campaign } = useLoaderData<typeof loader>();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  
  const handleVideoComplete = () => {
    setShowRedirectMessage(true);
    
    // Redirect to affiliate URL after a short delay
    const sanitizedUrl = sanitizeUrl(campaign.affiliateUrl);
    if (sanitizedUrl) {
      setTimeout(() => {
        window.open(sanitizedUrl, '_blank', 'noopener,noreferrer');
      }, 1500);
    }
  };
  
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
          
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="p-6">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">{campaign.name}</h2>
              
              <div className="mb-8">
                <VideoEmbed 
                  videoUrl={campaign.videoUrl} 
                  className="aspect-video" 
                  onVideoComplete={handleVideoComplete}
                />
              </div>
              
              {showRedirectMessage ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
                  <p className="text-blue-700">
                    Thanks for watching! You're being redirected to the offer page...
                  </p>
                </div>
              ) : null}
              
              <div>
                <AffiliateFrame affiliateUrl={campaign.affiliateUrl} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
