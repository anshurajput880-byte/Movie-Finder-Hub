import { useWatchlist } from "@/hooks/use-watchlist";
import { MediaCard } from "@/components/shared/MediaCard";
import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function MyList() {
  const { list, save } = useWatchlist();

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">My List</h1>
          <p className="text-white/50 text-sm">{list.length} title{list.length !== 1 ? "s" : ""} saved</p>
        </div>
        {list.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-red-400 gap-2"
            onClick={() => save([])}
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <Bookmark className="w-16 h-16 text-white/10 mb-6" />
          <h2 className="text-2xl font-serif text-white/40 mb-3">Nothing saved yet</h2>
          <p className="text-white/30 text-sm mb-8 max-w-xs">
            Hover over any movie or show and tap the bookmark icon to save it here.
          </p>
          <Link href="/">
            <Button className="bg-primary text-black hover:bg-primary/90">Browse Movies</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {list.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <MediaCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
