import { useParams } from "wouter";
import { useGetGenres, useGetPopular } from "@workspace/api-client-react";
import { MediaCard } from "@/components/shared/MediaCard";
import { Skeleton } from "@/components/ui/skeleton";

export function Genre() {
  const params = useParams();
  const id = Number(params.id);

  const { data: genresData } = useGetGenres();
  
  // Find genre name from either movie or tv genres
  const genreName = genresData?.movie_genres.find(g => g.id === id)?.name 
    || genresData?.tv_genres.find(g => g.id === id)?.name 
    || "Genre";

  // Since we don't have a specific discover endpoint to filter by genre,
  // we'll fetch popular and filter them locally as a fallback, 
  // or just show them if they match.
  const { data, isLoading } = useGetPopular({ page: 1 });
  
  // Local filter for demo purposes since API doesn't support genre filtering directly in this spec
  const genreItems = data?.results?.filter(item => item.genre_ids?.includes(id)) || [];

  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-12">
        {genreName} Movies
      </h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[2/3] rounded-xl" />
          ))
        ) : genreItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No popular movies found for this genre.
          </div>
        ) : (
          genreItems.map((item) => (
            <div key={`${item.id}-${item.media_type || ''}`} className="w-full flex justify-center">
              <MediaCard item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
