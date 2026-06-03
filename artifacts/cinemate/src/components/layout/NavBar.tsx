import { Link, useLocation } from "wouter";
import { Search, Clapperboard, Bookmark, Shuffle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useGetTrending, GetTrendingMediaType, GetTrendingTimeWindow } from "@workspace/api-client-react";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const { list } = useWatchlist();

  const { data: trending } = useGetTrending({
    mediaType: GetTrendingMediaType.all,
    timeWindow: GetTrendingTimeWindow.day
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: "/" opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setLocation("/search");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setLocation]);

  const handleSurpriseMe = useCallback(() => {
    const pool = trending?.results;
    if (!pool || pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setLocation(`/${pick.media_type || "movie"}/${pick.id}`);
  }, [trending, setLocation]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
        isScrolled ? "glass-panel py-3" : "bg-gradient-to-b from-background/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Clapperboard className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-serif text-2xl font-bold tracking-wider text-white">
            Cine<span className="text-primary">Mate</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        {/* Surprise Me — desktop */}
        <Button
          variant="ghost"
          className="hidden md:flex text-white/70 hover:text-primary hover:bg-white/5 gap-2 text-sm"
          onClick={handleSurpriseMe}
          title="Surprise Me — pick a random title"
        >
          <Shuffle className="w-4 h-4" />
          Surprise Me
        </Button>

        {/* Surprise Me — mobile icon */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white/70 hover:text-primary hover:bg-white/5"
          onClick={handleSurpriseMe}
          title="Surprise Me"
        >
          <Shuffle className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/search")}
          className="text-white hover:text-primary hover:bg-white/5"
          title="Search (press /)"
        >
          <Search className="w-5 h-5" />
        </Button>

        <Link href="/mylist">
          <Button
            variant="ghost"
            className="relative text-white hover:text-primary hover:bg-white/5 gap-2 hidden sm:flex"
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-sm">My List</span>
            {list.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center">
                {list.length > 99 ? "99+" : list.length}
              </span>
            )}
          </Button>
        </Link>

        <Link href="/mylist">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-primary hover:bg-white/5 sm:hidden"
          >
            <Bookmark className="w-5 h-5" />
            {list.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-black text-[10px] font-bold flex items-center justify-center">
                {list.length}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
