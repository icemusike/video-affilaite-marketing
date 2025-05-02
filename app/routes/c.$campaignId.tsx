import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AffiliateFrame from "~/components/AffiliateFrame";
import VideoEmbed from "~/components/VideoEmbed";
import { getCampaign } from "~/models/campaign.server";

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

export default function CampaignPage() {
  const { campaign } = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">{campaign.name}</h1>
            
            <div className="mb-8">
              <VideoEmbed videoUrl={campaign.videoUrl} className="aspect-video" />
            </div>
            
            <div>
              <AffiliateFrame affiliateUrl={campaign.affiliateUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
