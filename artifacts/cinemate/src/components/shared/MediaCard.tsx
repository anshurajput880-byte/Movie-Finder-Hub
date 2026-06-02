import { Link } from "wouter";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { MediaItem } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";

interface MediaCardProps {
  item: MediaItem;
  rank?: number;
}

export function MediaCard({ item, rank }: MediaCardProps) {
  const type = item.media_type || (item.name ? "tv" : "movie");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date)?.split("-")[0];
  const { toggle, isInList } = useWatchlist();
  const saved = isInList(item.id);

  return (
    <div className="relative flex-none">
      {rank !== undefined && (
        <span className="absolute -left-3 bottom-0 z-10 text-[80px] md:text-[100px] font-serif font-black leading-none text-white/10 select-none pointer-events-none">
          {rank}
        </span>
      )}
      <Link href={`/${type}/${item.id}`}>
        <motion.div
          className="group relative w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden bg-muted cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={getTmdbImageUrl(item.poster_path, "poster")}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="font-serif font-semibold text-sm md:text-base line-clamp-2 text-white shadow-sm leading-tight">
              {title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs text-white/80">
              <span>{year}</span>
              {item.vote_average ? (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  {item.vote_average.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        </motion.div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); toggle({ ...item, media_type: type }); }}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
          saved
            ? "bg-primary text-black opacity-100"
            : "bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-black/80"
        }`}
        title={saved ? "Remove from My List" : "Add to My List"}
      >
        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      </button>
    </div>
  );
}
