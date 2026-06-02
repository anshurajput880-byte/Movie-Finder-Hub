import { MediaItem } from "@workspace/api-client-react";
import { MediaCard } from "./MediaCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaRowProps {
  title: string;
  items?: MediaItem[];
  isLoading?: boolean;
}

export function MediaRow({ title, items, isLoading }: MediaRowProps) {
  return (
    <div className="my-8 md:my-12">
      <h2 className="text-xl md:text-2xl font-serif font-semibold px-6 mb-6 text-white/90">
        {title}
      </h2>
      
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-4 px-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="flex-none w-[160px] md:w-[220px] aspect-[2/3] rounded-xl" />
            ))
          ) : items?.map((item) => (
            <MediaCard key={`${item.id}-${item.media_type || ''}`} item={item} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
