import { useParams } from "wouter";
import { 
  useGetMediaDetails, 
  useGetMediaCredits, 
  useGetMediaSimilar,
  getGetMediaDetailsQueryKey,
  getGetMediaCreditsQueryKey,
  getGetMediaSimilarQueryKey
} from "@workspace/api-client-react";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { VidKingPlayer } from "@/components/shared/VidKingPlayer";
import { MediaRow } from "@/components/shared/MediaRow";
import { Button } from "@/components/ui/button";
import { Play, Star, Clock, Calendar, Bookmark, BookmarkCheck, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { TrailerModal } from "@/components/shared/TrailerModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import { useWatchlist } from "@/hooks/use-watchlist";

export function Movie() {
  const params = useParams();
  const id = Number(params.id);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { track } = useContinueWatching();
  const { toggle, isInList } = useWatchlist();

  useEffect(() => {
    setShowPlayer(false);
    window.scrollTo(0, 0);
  }, [id]);

  const { data: movie, isLoading } = useGetMediaDetails("movie", id, {
    query: { enabled: !!id, queryKey: getGetMediaDetailsQueryKey("movie", id) }
  });

  const { data: credits, isLoading: isLoadingCredits } = useGetMediaCredits("movie", id, {
    query: { enabled: !!id, queryKey: getGetMediaCreditsQueryKey("movie", id) }
  });

  const { data: similar, isLoading: isLoadingSimilar } = useGetMediaSimilar("movie", id, {
    query: { enabled: !!id, queryKey: getGetMediaSimilarQueryKey("movie", id) }
  });

  if (isLoading || !movie) {
    return <div className="w-full h-screen bg-background animate-pulse" />;
  }

  const year = movie.release_date?.split("-")[0];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <div className="pb-20">
      {showTrailer && movie && (
        <TrailerModal
          mediaType="movie"
          tmdbId={movie.id}
          title={movie.title || ""}
          onClose={() => setShowTrailer(false)}
        />
      )}
      {/* Backdrop */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-black">
        <div className="absolute inset-0">
          <img 
            src={getTmdbImageUrl(movie.backdrop_path, 'backdrop')} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 -mt-48 md:-mt-64">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <div className="flex-none w-48 md:w-72 hidden md:block">
            <img 
              src={getTmdbImageUrl(movie.poster_path, 'poster')} 
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl poster-glow"
            />
          </div>

          {/* Info */}
          <div className="flex-1 mt-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/70 mb-6">
              {movie.vote_average ? (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </span>
              ) : null}
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {runtime}
                </span>
              )}
              {movie.genres?.map(g => (
                <span key={g.id} className="px-2 py-1 rounded-md bg-white/10 text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            {movie.tagline && (
              <p className="text-primary italic mb-4 font-serif text-lg">{movie.tagline}</p>
            )}
            
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-12">
              {!showPlayer && (
                <Button
                  size="lg"
                  className="text-lg px-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setShowPlayer(true);
                    if (movie) {
                      track({
                        id: movie.id,
                        title: movie.title || movie.name || "",
                        poster_path: movie.poster_path ?? null,
                        backdrop_path: movie.backdrop_path ?? null,
                        media_type: "movie",
                      });
                    }
                  }}
                >
                  <Play className="w-5 h-5 fill-current" /> Watch Movie
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 gap-2 bg-black/40 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 backdrop-blur-sm"
                onClick={() => setShowTrailer(true)}
              >
                <Youtube className="w-5 h-5" /> Trailer
              </Button>
              {movie && (
                <Button
                  size="lg"
                  variant="outline"
                  className={`text-lg px-8 gap-2 border-white/20 backdrop-blur-sm ${
                    isInList(movie.id)
                      ? "bg-primary/20 text-primary border-primary/50"
                      : "bg-black/40 text-white hover:bg-white/20"
                  }`}
                  onClick={() => toggle({ id: movie.id, title: movie.title, poster_path: movie.poster_path, backdrop_path: movie.backdrop_path, media_type: "movie" })}
                >
                  {isInList(movie.id)
                    ? <><BookmarkCheck className="w-5 h-5" /> Saved</>
                    : <><Bookmark className="w-5 h-5" /> My List</>}
                </Button>
              )}
            </div>
          </div>
        </div>

        {showPlayer && (
          <div className="mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <VidKingPlayer mediaType="movie" tmdbId={movie.id} />
          </div>
        )}

        {/* Cast */}
        {credits?.cast && credits.cast.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-white/90">Top Cast</h2>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4">
                {credits.cast.slice(0, 10).map((person) => (
                  <div key={person.id} className="flex-none w-32 md:w-40 text-center">
                    <div className="w-full aspect-square rounded-full overflow-hidden mb-3 bg-muted">
                      {person.profile_path ? (
                        <img 
                          src={getTmdbImageUrl(person.profile_path, 'profile')} 
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm text-white truncate">{person.name}</p>
                    <p className="text-xs text-white/50 truncate">{person.character}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="-ml-6 -mr-6 md:-ml-12 md:-mr-12">
        <MediaRow title="Similar Movies" items={similar?.results} isLoading={isLoadingSimilar} />
      </div>
    </div>
  );
}
