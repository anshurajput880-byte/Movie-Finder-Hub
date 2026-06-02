import { Link } from "wouter";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { Play, X, Tv, Film } from "lucide-react";
import { motion } from "framer-motion";

export function ContinueWatchingRow() {
  const { entries, remove } = useContinueWatching();

  if (entries.length === 0) return null;

  return (
    <div className="px-6 md:px-12 mb-10">
      <h2 className="text-xl md:text-2xl font-serif font-semibold text-white/90 mb-4">Continue Watching</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {entries.map((entry) => (
          <motion.div
            key={`${entry.id}-${entry.season}-${entry.episode}`}
            className="relative flex-none w-[260px] md:w-[320px] group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href={`/${entry.media_type}/${entry.id}`}>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer">
                <img
                  src={getTmdbImageUrl(entry.backdrop_path || entry.poster_path, "backdrop")}
                  alt={entry.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-white text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm truncate">{entry.title}</p>
                  {entry.media_type === "tv" && entry.season && entry.episode && (
                    <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                      <Tv className="w-3 h-3" /> S{entry.season} E{entry.episode}
                      {entry.episode_name && ` · ${entry.episode_name}`}
                    </p>
                  )}
                  {entry.media_type === "movie" && (
                    <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                      <Film className="w-3 h-3" /> Movie
                    </p>
                  )}
                </div>
              </div>
            </Link>
            <button
              onClick={() => remove(entry.id)}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/60 text-white/50 hover:text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-all"
              title="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
