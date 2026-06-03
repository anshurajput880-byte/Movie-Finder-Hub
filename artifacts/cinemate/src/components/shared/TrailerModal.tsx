import { useGetMediaVideos, getGetMediaVideosQueryKey } from "@workspace/api-client-react";
import { X, Youtube } from "lucide-react";
import { useEffect } from "react";

interface TrailerModalProps {
  mediaType: "movie" | "tv";
  tmdbId: number;
  title: string;
  onClose: () => void;
}

export function TrailerModal({ mediaType, tmdbId, title, onClose }: TrailerModalProps) {
  const { data, isLoading } = useGetMediaVideos(mediaType, tmdbId, {
    query: { queryKey: getGetMediaVideosQueryKey(mediaType, tmdbId) }
  });

  const trailer =
    data?.results?.find(v => v.type === "Trailer" && v.official) ||
    data?.results?.find(v => v.type === "Trailer") ||
    data?.results?.find(v => v.type === "Teaser") ||
    data?.results?.[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white">
            <Youtube className="w-5 h-5 text-red-500" />
            <span className="font-medium truncate">{title}</span>
            {trailer && <span className="text-white/40 text-sm">— {trailer.name}</span>}
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              Loading trailer…
            </div>
          ) : !trailer ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <Youtube className="w-12 h-12" />
              <p>No trailer available</p>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={trailer.name}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
