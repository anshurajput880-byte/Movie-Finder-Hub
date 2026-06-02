interface VidKingPlayerProps {
  mediaType: "movie" | "tv";
  tmdbId: number;
  seasonNumber?: number;
  episodeNumber?: number;
}

export function VidKingPlayer({ mediaType, tmdbId, seasonNumber, episodeNumber }: VidKingPlayerProps) {
  const url = mediaType === "movie" 
    ? `https://vidking.net/embed/movie/${tmdbId}`
    : `https://vidking.net/embed/tv/${tmdbId}/${seasonNumber}/${episodeNumber}`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl poster-glow">
      <iframe
        src={url}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}
