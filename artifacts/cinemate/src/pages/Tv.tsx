import { useParams } from "wouter";
import { 
  useGetMediaDetails, 
  useGetMediaCredits, 
  useGetMediaSimilar,
  useGetSeasonDetails,
  getGetMediaDetailsQueryKey,
  getGetMediaCreditsQueryKey,
  getGetMediaSimilarQueryKey,
  getGetSeasonDetailsQueryKey
} from "@workspace/api-client-react";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { VidKingPlayer } from "@/components/shared/VidKingPlayer";
import { MediaRow } from "@/components/shared/MediaRow";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Star, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function Tv() {
  const params = useParams();
  const id = Number(params.id);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  useEffect(() => {
    setSelectedSeason(1);
    setSelectedEpisode(null);
    window.scrollTo(0, 0);
  }, [id]);

  const { data: tv, isLoading } = useGetMediaDetails("tv", id, {
    query: { enabled: !!id, queryKey: getGetMediaDetailsQueryKey("tv", id) }
  });

  const { data: credits, isLoading: isLoadingCredits } = useGetMediaCredits("tv", id, {
    query: { enabled: !!id, queryKey: getGetMediaCreditsQueryKey("tv", id) }
  });

  const { data: similar, isLoading: isLoadingSimilar } = useGetMediaSimilar("tv", id, {
    query: { enabled: !!id, queryKey: getGetMediaSimilarQueryKey("tv", id) }
  });

  const { data: seasonDetails, isLoading: isLoadingSeason } = useGetSeasonDetails(id, selectedSeason, {
    query: { enabled: !!id && !!selectedSeason, queryKey: getGetSeasonDetailsQueryKey(id, selectedSeason) }
  });

  if (isLoading || !tv) {
    return <div className="w-full h-screen bg-background animate-pulse" />;
  }

  const year = tv.first_air_date?.split("-")[0];
  const seasons = tv.seasons?.filter(s => s.season_number > 0) || [];

  return (
    <div className="pb-20">
      {/* Backdrop */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-black">
        <div className="absolute inset-0">
          <img 
            src={getTmdbImageUrl(tv.backdrop_path, 'backdrop')} 
            alt={tv.name}
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
              src={getTmdbImageUrl(tv.poster_path, 'poster')} 
              alt={tv.name}
              className="w-full rounded-xl shadow-2xl poster-glow"
            />
          </div>

          {/* Info */}
          <div className="flex-1 mt-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              {tv.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/70 mb-6">
              {tv.vote_average ? (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {tv.vote_average.toFixed(1)}
                </span>
              ) : null}
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {year}
                </span>
              )}
              <span className="px-2 py-1 rounded-md bg-white/10 text-xs">
                {tv.number_of_seasons} Seasons
              </span>
              {tv.genres?.map(g => (
                <span key={g.id} className="px-2 py-1 rounded-md bg-white/10 text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            {tv.tagline && (
              <p className="text-primary italic mb-4 font-serif text-lg">{tv.tagline}</p>
            )}
            
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-3xl">
              {tv.overview}
            </p>
          </div>
        </div>

        {selectedEpisode && (
          <div className="mt-12 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <VidKingPlayer 
              mediaType="tv" 
              tmdbId={tv.id} 
              seasonNumber={selectedSeason} 
              episodeNumber={selectedEpisode} 
            />
          </div>
        )}

        {/* Season / Episode Selector */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-serif font-semibold text-white">Episodes</h2>
            {seasons.length > 0 && (
              <Select 
                value={selectedSeason.toString()} 
                onValueChange={(v) => {
                  setSelectedSeason(Number(v));
                  setSelectedEpisode(null);
                }}
              >
                <SelectTrigger className="w-[180px] bg-background border-white/20">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(s => (
                    <SelectItem key={s.id} value={s.season_number.toString()}>
                      Season {s.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isLoadingSeason ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {seasonDetails?.episodes?.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEpisode(ep.episode_number)}
                  className={cn(
                    "flex gap-4 p-3 rounded-xl text-left transition-colors",
                    selectedEpisode === ep.episode_number 
                      ? "bg-primary/20 border border-primary/50" 
                      : "bg-black/40 border border-white/5 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex-none w-32 aspect-video bg-muted rounded-md overflow-hidden relative">
                    {ep.still_path ? (
                      <img 
                        src={getTmdbImageUrl(ep.still_path, 'backdrop')} 
                        alt={ep.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Play className="w-6 h-6 text-white/20" />
                      </div>
                    )}
                    {selectedEpisode === ep.episode_number && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">
                      {ep.overview || "No overview available."}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

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
        <MediaRow title="Similar Shows" items={similar?.results} isLoading={isLoadingSimilar} />
      </div>
    </div>
  );
}
