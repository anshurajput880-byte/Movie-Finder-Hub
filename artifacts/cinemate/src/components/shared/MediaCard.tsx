import { Link } from "wouter";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { MediaItem } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface MediaCardProps {
  item: MediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  const type = item.media_type || (item.name ? "tv" : "movie");
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date)?.split("-")[0];

  return (
    <Link href={`/${type}/${item.id}`}>
      <motion.div 
        className="group relative flex-none w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden bg-muted cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src={getTmdbImageUrl(item.poster_path, 'poster')}
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
  );
}
