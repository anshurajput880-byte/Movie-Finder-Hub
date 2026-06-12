import { useState } from "react";

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

  const url = SOURCES[activeSource].getUrl(mediaType, tmdbId, seasonNumber, episodeNumber);

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
        <span className="text-xs text-white/30 ml-auto">Switch server if video doesn't load</span>
      </div>
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
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
