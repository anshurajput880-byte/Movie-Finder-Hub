import { useState, useEffect, useRef } from "react";
import { useSearchMovies, SearchMoviesMediaType, useGetGenres } from "@workspace/api-client-react";
import { MediaCard } from "@/components/shared/MediaCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Tv, Film, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_OPTIONS = [
  { label: "All", value: SearchMoviesMediaType.all, icon: LayoutGrid },
  { label: "Movies", value: SearchMoviesMediaType.movie, icon: Film },
  { label: "TV Shows", value: SearchMoviesMediaType.tv, icon: Tv },
];

export function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mediaType, setMediaType] = useState<SearchMoviesMediaType>(SearchMoviesMediaType.all);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount and re-focus when "/" shortcut is used
  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useSearchMovies(
    { query: debouncedQuery, mediaType },
    { query: { enabled: debouncedQuery.length > 0 } }
  );

  const { data: genres } = useGetGenres();
  const allGenres = [
    ...(genres?.movie_genres ?? []),
    ...(genres?.tv_genres ?? []),
  ].filter((g, i, arr) => arr.findIndex(x => x.id === g.id) === i);

  const hasResults = (data?.results?.length ?? 0) > 0;

  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen">
      {/* Search bar */}
      <div className="max-w-4xl mx-auto mb-6 relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows…"
          className="w-full pl-14 pr-36 h-16 text-xl bg-muted/50 border-white/10 rounded-2xl focus-visible:ring-primary text-white"
        />
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 text-white/30 text-xs font-mono">
          press /
        </kbd>
      </div>

      {/* Type filter pills */}
      <div className="max-w-4xl mx-auto flex items-center gap-2 mb-8 flex-wrap">
        {TYPE_OPTIONS.map(({ label, value, icon: Icon }) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            className={`gap-2 rounded-full px-4 border transition-all ${
              mediaType === value
                ? "bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
                : "border-white/10 text-white/60 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setMediaType(value)}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Button>
        ))}
      </div>

      {/* Results */}
      {debouncedQuery.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif mb-6 text-white/90">
            {hasResults
              ? <>Results for <span className="text-primary">"{debouncedQuery}"</span> {data?.total_results ? <span className="text-sm text-white/40 font-sans font-normal">({data.total_results.toLocaleString()} found)</span> : null}</>
              : <>No results for "{debouncedQuery}"</>}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[2/3] rounded-xl" />
              ))
            ) : !hasResults ? (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Try a different search term or filter.</p>
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

      {/* Browse by genre (shown when no query) */}
      {debouncedQuery.length === 0 && allGenres.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif mb-6 text-white/90">Browse by Genre</h2>
          <div className="flex flex-wrap gap-3">
            {allGenres.map(g => (
              <a
                key={g.id}
                href={`/genre/${g.id}`}
                className="px-4 py-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all text-sm"
              >
                {g.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
