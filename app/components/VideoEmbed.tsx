import { getEmbedUrl, getVideoProvider } from "~/utils/video";

interface VideoEmbedProps {
  videoUrl: string;
  className?: string;
}

export default function VideoEmbed({ videoUrl, className = "" }: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(videoUrl);
  const provider = getVideoProvider(videoUrl);
  
  if (!embedUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <p className="text-gray-500">Invalid video URL</p>
      </div>
    );
  }
  
  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`} style={{ paddingTop: '56.25%' }}>
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`${provider} video player`}
      ></iframe>
    </div>
  );
}
