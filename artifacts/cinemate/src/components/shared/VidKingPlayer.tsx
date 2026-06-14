import { useState, useRef, useEffect } from "react";

interface VidKingPlayerProps {
  mediaType: "movie" | "tv";
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
}

const SOURCES = [
  {
    name: "VidKing",
    getUrl: (type: string, id: number, s?: number, e?: number) =>
      type === "movie"
        ? `https://vidking.net/embed/movie/${id}`
        : `https://vidking.net/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 2",
    getUrl: (type: string, id: number, s?: number, e?: number) =>
      type === "movie"
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 3",
    getUrl: (type: string, id: number, s?: number, e?: number) =>
      type === "movie"
        ? `https://player.videasy.net/movie/${id}`
        : `https://player.videasy.net/tv/${id}?season=${s}&episode=${e}`,
  },
  {
    name: "Server 4",
    getUrl: (type: string, id: number, s?: number, e?: number) =>
      type === "movie"
        ? `https://vidsrc.me/embed/movie?tmdb=${id}`
        : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: "Server 5",
    getUrl: (type: string, id: number, s?: number, e?: number) =>
      type === "movie"
        ? `https://ezvidapi.com/embed/movie/${id}`
        : `https://ezvidapi.com/embed/tv/${id}/${s}/${e}`,
  },
];

export function VidKingPlayer({ mediaType, tmdbId, seasonNumber, episodeNumber }: VidKingPlayerProps) {
  const [activeSource, setActiveSource] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const url = SOURCES[activeSource].getUrl(mediaType, tmdbId, seasonNumber, episodeNumber);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2 items-center">
        {SOURCES.map((source, i) => (
          <button
            key={source.name}
            onClick={() => setActiveSource(i)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeSource === i
                ? "bg-primary text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
            }`}
          >
            {source.name}
          </button>
        ))}
        <span className="text-xs text-white/30">Switch server if video doesn't load</span>
        <button
          onClick={toggleFullscreen}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
              </svg>
              Exit
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
              Fullscreen
            </>
          )}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative w-full bg-black shadow-2xl ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none"
            : "aspect-video rounded-xl"
        }`}
      >
        <iframe
          key={url}
          src={url}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
