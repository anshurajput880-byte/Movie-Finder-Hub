import {
  useGetTrending,
  useGetPopular,
  useGetPopularTv,
  useGetTopRated,
  GetTrendingMediaType,
  GetTrendingTimeWindow
} from "@workspace/api-client-react";
import { MediaRow } from "@/components/shared/MediaRow";
import { ContinueWatchingRow } from "@/components/shared/ContinueWatchingRow";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/shared/MediaCard";

export function Home() {
  const { data: trending, isLoading: isLoadingTrending } = useGetTrending({
    mediaType: GetTrendingMediaType.all,
    timeWindow: GetTrendingTimeWindow.day
  });

  const { data: popularMovies, isLoading: isLoadingPopularMovies } = useGetPopular();
  const { data: popularTv, isLoading: isLoadingPopularTv } = useGetPopularTv();
  const { data: topRated, isLoading: isLoadingTopRated } = useGetTopRated();

  const heroItem = trending?.results?.[0];
  const top10 = trending?.results?.slice(0, 10) || [];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] md:h-[85vh] bg-black">
        {isLoadingTrending || !heroItem ? (
          <div className="w-full h-full bg-muted animate-pulse" />
        ) : (
          <>
            <div className="absolute inset-0">
              <img
                src={getTmdbImageUrl(heroItem.backdrop_path, "backdrop")}
                alt={heroItem.title || heroItem.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:pb-24 lg:w-2/3">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight">
                {heroItem.title || heroItem.name}
              </h1>
              <p className="text-base md:text-lg text-white/80 line-clamp-3 mb-8 max-w-2xl">
                {heroItem.overview}
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/${heroItem.media_type || "movie"}/${heroItem.id}`}>
                  <Button size="lg" className="text-lg px-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Play className="w-5 h-5 fill-current" /> Watch Now
                  </Button>
                </Link>
                <Link href={`/${heroItem.media_type || "movie"}/${heroItem.id}`}>
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2 bg-black/40 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                    <Info className="w-5 h-5" /> More Info
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 -mt-8">
        {/* Continue Watching */}
        <ContinueWatchingRow />

        {/* Top 10 Today */}
        <div className="px-6 md:px-12 mb-10">
          <h2 className="text-xl md:text-2xl font-serif font-semibold text-white/90 mb-4">Top 10 Today</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {isLoadingTrending
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-none w-[160px] md:w-[220px] aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                ))
              : top10.map((item, i) => (
                  <div key={item.id} className="relative pl-6">
                    <MediaCard item={item} rank={i + 1} />
                  </div>
                ))}
          </div>
        </div>

        <MediaRow title="Trending Today" items={trending?.results?.slice(1)} isLoading={isLoadingTrending} />
        <MediaRow title="Popular Movies" items={popularMovies?.results} isLoading={isLoadingPopularMovies} />
        <MediaRow title="Popular TV Shows" items={popularTv?.results} isLoading={isLoadingPopularTv} />
        <MediaRow title="Top Rated" items={topRated?.results} isLoading={isLoadingTopRated} />
      </div>
    </div>
  );
}
