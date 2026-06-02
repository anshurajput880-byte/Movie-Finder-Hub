import { useState, useEffect } from "react";
import { useSearchMovies, SearchMoviesMediaType } from "@workspace/api-client-react";
import { MediaCard } from "@/components/shared/MediaCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useSearchMovies(
    { query: debouncedQuery, mediaType: SearchMoviesMediaType.all },
    { query: { enabled: debouncedQuery.length > 0 } }
  );

  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-4xl mx-auto mb-12 relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows..."
          className="w-full pl-14 h-16 text-xl bg-muted/50 border-white/10 rounded-2xl focus-visible:ring-primary text-white"
        />
      </div>

      {debouncedQuery.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif mb-6 text-white/90">
            Search Results for "{debouncedQuery}"
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[2/3] rounded-xl" />
              ))
            ) : data?.results?.length === 0 ? (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No results found. Try a different search term.
              </div>
            ) : (
              data?.results?.map((item) => (
                <div key={`${item.id}-${item.media_type || ''}`} className="w-full flex justify-center">
                  <MediaCard item={item} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
