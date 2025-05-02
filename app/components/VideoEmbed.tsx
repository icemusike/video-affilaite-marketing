import { useEffect, useRef, useState } from "react";
import { getEmbedUrl, getVideoProvider } from "~/utils/video";

interface VideoEmbedProps {
  videoUrl: string;
  className?: string;
  onVideoComplete?: () => void;
}

export default function VideoEmbed({ videoUrl, className = "", onVideoComplete }: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(videoUrl);
  const provider = getVideoProvider(videoUrl);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!onVideoComplete) return;
    
    // Handle YouTube video completion
    if (provider === 'youtube' && iframeRef.current) {
      // Load YouTube API
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Initialize YouTube player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        if (!iframeRef.current) return;
        
        const player = new window.YT.Player(iframeRef.current, {
          events: {
            'onStateChange': (event) => {
              // State 0 means the video has ended
              if (event.data === 0) {
                onVideoComplete();
              }
            },
            'onReady': () => {
              setIsLoading(false);
            }
          }
        });
      };
    }
    
    // Handle Vimeo video completion
    if (provider === 'vimeo' && iframeRef.current) {
      // Load Vimeo API
      const script = document.createElement('script');
      script.src = "https://player.vimeo.com/api/player.js";
      script.onload = () => {
        if (!iframeRef.current) return;
        
        const player = new window.Vimeo.Player(iframeRef.current);
        player.on('ended', () => {
          onVideoComplete();
        });
        player.on('loaded', () => {
          setIsLoading(false);
        });
      };
      document.body.appendChild(script);
    }
    
    return () => {
      // Cleanup
      window.onYouTubeIframeAPIReady = undefined;
      
      // Remove Vimeo script if it exists
      const vimeoScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
      if (vimeoScript) {
        vimeoScript.remove();
      }
    };
  }, [videoUrl, provider, onVideoComplete]);
  
  // Set loading to false after a timeout as fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!embedUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <p className="text-gray-500">Invalid video URL</p>
      </div>
    );
  }
  
  // Add API parameters to the embed URL
  let enhancedEmbedUrl = embedUrl;
  if (provider === 'youtube') {
    // Add YouTube API parameters
    enhancedEmbedUrl = `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}enablejsapi=1`;
  } else if (provider === 'vimeo') {
    // Add Vimeo API parameters
    enhancedEmbedUrl = `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}api=1`;
  }
  
  return (
    <div className={`relative w-full overflow-hidden rounded-lg shadow-lg ${className}`} style={{ paddingTop: '56.25%' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={enhancedEmbedUrl}
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`${provider} video player`}
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </div>
  );
}

// Add type definitions for the YouTube and Vimeo APIs
declare global {
  interface Window {
    YT: {
      Player: new (
        iframe: HTMLIFrameElement,
        options: {
          events: {
            onStateChange: (event: { data: number }) => void;
            onReady: () => void;
          };
        }
      ) => void;
    };
    onYouTubeIframeAPIReady: () => void;
    Vimeo: {
      Player: new (iframe: HTMLIFrameElement) => {
        on: (event: string, callback: () => void) => void;
      };
    };
  }
}
