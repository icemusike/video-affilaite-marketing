import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { isValidVideoUrl, getVideoProvider } from "~/utils/video";
import { isValidUrl } from "~/utils/url";

interface CampaignFormProps {
  defaultValues?: {
    name?: string;
    videoUrl?: string;
    affiliateUrl?: string;
    bonusUrl?: string;
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
  const bonusUrlRef = useRef<HTMLInputElement>(null);
  
  const [videoUrl, setVideoUrl] = useState(defaultValues.videoUrl || "");
  const [affiliateUrl, setAffiliateUrl] = useState(defaultValues.affiliateUrl || "");
  const [bonusUrl, setBonusUrl] = useState(defaultValues.bonusUrl || "");
  const [videoProvider, setVideoProvider] = useState<string | null>(null);
  const [isValidVideo, setIsValidVideo] = useState(false);
  const [isValidAffiliate, setIsValidAffiliate] = useState(false);
  const [isValidBonus, setIsValidBonus] = useState(false);
  
  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.videoUrl) {
      videoUrlRef.current?.focus();
    } else if (actionData?.errors?.affiliateUrl) {
      affiliateUrlRef.current?.focus();
    } else if (actionData?.errors?.bonusUrl) {
      bonusUrlRef.current?.focus();
    }
  }, [actionData]);
  
  useEffect(() => {
    if (videoUrl) {
      const provider = getVideoProvider(videoUrl);
      setVideoProvider(provider);
      setIsValidVideo(isValidVideoUrl(videoUrl));
    } else {
      setVideoProvider(null);
      setIsValidVideo(false);
    }
  }, [videoUrl]);
  
  useEffect(() => {
    if (affiliateUrl) {
      setIsValidAffiliate(isValidUrl(affiliateUrl));
    } else {
      setIsValidAffiliate(false);
    }
  }, [affiliateUrl]);
  
  useEffect(() => {
    if (bonusUrl) {
      setIsValidBonus(isValidUrl(bonusUrl));
    } else {
      // Empty bonus URL is valid since it's optional
      setIsValidBonus(true);
    }
  }, [bonusUrl]);
  
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
            placeholder="Enter a descriptive name for your campaign"
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
        <div className="mt-1 relative">
          <div className="flex">
            <input
              ref={videoUrlRef}
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              aria-invalid={actionData?.errors?.videoUrl ? true : undefined}
              aria-describedby="videoUrl-error"
              className={`w-full rounded border ${
                videoUrl && !isValidVideo 
                  ? "border-red-300 pr-10" 
                  : videoUrl && isValidVideo 
                  ? "border-green-300 pr-10" 
                  : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {videoUrl && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isValidVideo ? (
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {videoProvider && isValidVideo && (
            <div className="mt-1 text-sm text-green-600 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Valid {videoProvider.charAt(0).toUpperCase() + videoProvider.slice(1)} URL
            </div>
          )}
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
        <div className="mt-1 relative">
          <div className="flex">
            <input
              ref={affiliateUrlRef}
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              required
              aria-invalid={actionData?.errors?.affiliateUrl ? true : undefined}
              aria-describedby="affiliateUrl-error"
              className={`w-full rounded border ${
                affiliateUrl && !isValidAffiliate 
                  ? "border-red-300 pr-10" 
                  : affiliateUrl && isValidAffiliate 
                  ? "border-green-300 pr-10" 
                  : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="https://jvzoo.com/affiliate/..."
            />
            {affiliateUrl && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isValidAffiliate ? (
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {affiliateUrl && isValidAffiliate && (
            <div className="mt-1 text-sm text-green-600 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Valid URL
            </div>
          )}
          {actionData?.errors?.affiliateUrl && (
            <div className="mt-1 text-sm text-red-600" id="affiliateUrl-error">
              {actionData.errors.affiliateUrl}
            </div>
          )}
        </div>
      </div>
      
      {/* Bonus URL Field */}
      <div>
        <label htmlFor="bonusUrl" className="block text-sm font-medium text-gray-700">
          Bonus URL (Optional)
        </label>
        <div className="mt-1 relative">
          <div className="flex">
            <input
              ref={bonusUrlRef}
              id="bonusUrl"
              name="bonusUrl"
              type="url"
              value={bonusUrl}
              onChange={(e) => setBonusUrl(e.target.value)}
              aria-invalid={actionData?.errors?.bonusUrl ? true : undefined}
              aria-describedby="bonusUrl-error"
              className={`w-full rounded border ${
                bonusUrl && !isValidBonus 
                  ? "border-red-300 pr-10" 
                  : bonusUrl && isValidBonus 
                  ? "border-green-300 pr-10" 
                  : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="https://example.com/bonus-offer"
            />
            {bonusUrl && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isValidBonus ? (
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {bonusUrl && isValidBonus && (
            <div className="mt-1 text-sm text-green-600 flex items-center">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Valid Bonus URL
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500">
            Add an optional bonus link that will be displayed below the video
          </div>
          {actionData?.errors?.bonusUrl && (
            <div className="mt-1 text-sm text-red-600" id="bonusUrl-error">
              {actionData.errors.bonusUrl}
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
