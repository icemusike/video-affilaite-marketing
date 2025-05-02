import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import CampaignForm from "~/components/CampaignForm";
import Header from "~/components/Header";
import { getCampaign, updateCampaign } from "~/models/campaign.server";
import { isValidVideoUrl } from "~/utils/video";
import { isValidUrl } from "~/utils/url";

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

export async function action({ request, params }: ActionFunctionArgs) {
  const campaignId = params.campaignId;
  
  if (!campaignId) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const affiliateUrl = formData.get("affiliateUrl") as string;
  
  const errors: Record<string, string> = {};
  
  if (!name || name.trim() === "") {
    errors.name = "Campaign name is required";
  }
  
  if (!videoUrl || videoUrl.trim() === "") {
    errors.videoUrl = "Video URL is required";
  } else if (!isValidVideoUrl(videoUrl)) {
    errors.videoUrl = "Please enter a valid YouTube or Vimeo URL";
  }
  
  if (!affiliateUrl || affiliateUrl.trim() === "") {
    errors.affiliateUrl = "Affiliate URL is required";
  } else if (!isValidUrl(affiliateUrl)) {
    errors.affiliateUrl = "Please enter a valid URL";
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  const campaign = await updateCampaign(campaignId, { name, videoUrl, affiliateUrl });
  
  if (!campaign) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return redirect(`/admin/campaigns/${campaign.id}`);
}

export default function EditCampaign() {
  const { campaign } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
            <p className="mt-2 text-sm text-gray-700">
              Update your video affiliate campaign
            </p>
          </div>
          
          <div className="mt-8">
            <div className="rounded-lg bg-white p-6 shadow">
              <CampaignForm
                defaultValues={{
                  name: campaign.name,
                  videoUrl: campaign.videoUrl,
                  affiliateUrl: campaign.affiliateUrl,
                }}
                mode="edit"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
