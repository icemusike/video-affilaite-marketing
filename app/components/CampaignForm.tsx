import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { isValidVideoUrl } from "~/utils/video";
import { isValidUrl } from "~/utils/url";

interface CampaignFormProps {
  defaultValues?: {
    name?: string;
    videoUrl?: string;
    affiliateUrl?: string;
  };
  mode?: "create" | "edit";
}

export default function CampaignForm({ 
  defaultValues = {}, 
  mode = "create" 
}: CampaignFormProps) {
  const actionData = useActionData<{ errors?: Record<string, string> }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const nameRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<HTMLInputElement>(null);
  const affiliateUrlRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.videoUrl) {
      videoUrlRef.current?.focus();
    } else if (actionData?.errors?.affiliateUrl) {
      affiliateUrlRef.current?.focus();
    }
  }, [actionData]);
  
  return (
    <Form method="post" className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Campaign Name
        </label>
        <div className="mt-1">
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            defaultValue={defaultValues.name}
            required
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-error"
            className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {actionData?.errors?.name && (
            <div className="mt-1 text-sm text-red-600" id="name-error">
              {actionData.errors.name}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
          Video URL (YouTube or Vimeo)
        </label>
        <div className="mt-1">
          <input
            ref={videoUrlRef}
            id="videoUrl"
            name="videoUrl"
            type="url"
            defaultValue={defaultValues.videoUrl}
            required
            aria-invalid={actionData?.errors?.videoUrl ? true : undefined}
            aria-describedby="videoUrl-error"
            className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {actionData?.errors?.videoUrl && (
            <div className="mt-1 text-sm text-red-600" id="videoUrl-error">
              {actionData.errors.videoUrl}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="affiliateUrl" className="block text-sm font-medium text-gray-700">
          Affiliate URL
        </label>
        <div className="mt-1">
          <input
            ref={affiliateUrlRef}
            id="affiliateUrl"
            name="affiliateUrl"
            type="url"
            defaultValue={defaultValues.affiliateUrl}
            required
            aria-invalid={actionData?.errors?.affiliateUrl ? true : undefined}
            aria-describedby="affiliateUrl-error"
            className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://jvzoo.com/affiliate/..."
          />
          {actionData?.errors?.affiliateUrl && (
            <div className="mt-1 text-sm text-red-600" id="affiliateUrl-error">
              {actionData.errors.affiliateUrl}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Campaign" : "Update Campaign"}
        </button>
      </div>
    </Form>
  );
}
