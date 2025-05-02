import { Link } from "@remix-run/react";
import { Campaign } from "~/models/campaign.server";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span className="truncate">
            Created: {new Date(campaign.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-4 flex space-x-3">
          <Link
            to={`/admin/campaigns/${campaign.id}`}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </Link>
          <Link
            to={`/admin/campaigns/${campaign.id}/preview`}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Preview
          </Link>
          <Link
            to={`/c/${campaign.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-transparent bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            View Live
          </Link>
        </div>
      </div>
    </div>
  );
}
