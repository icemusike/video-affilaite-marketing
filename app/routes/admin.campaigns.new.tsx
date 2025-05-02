import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import CampaignForm from "~/components/CampaignForm";
import Header from "~/components/Header";
import { createCampaign } from "~/models/campaign.server";
import { isValidVideoUrl } from "~/utils/video";
import { isValidUrl } from "~/utils/url";

export async function action({ request }: ActionFunctionArgs) {
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
  
  const campaign = await createCampaign({ name, videoUrl, affiliateUrl });
  
  return redirect(`/admin/campaigns/${campaign.id}`);
}

export default function NewCampaign() {
  const actionData = useActionData<typeof action>();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="mt-2 text-sm text-gray-700">
              Set up a new video affiliate campaign
            </p>
          </div>
          
          <div className="mt-8">
            <div className="rounded-lg bg-white p-6 shadow">
              <CampaignForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
