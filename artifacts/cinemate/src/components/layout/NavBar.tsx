import { Link, useLocation } from "wouter";
import { Search, Clapperboard } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
        isScrolled ? "glass-panel py-3" : "bg-gradient-to-b from-background/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Clapperboard className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-serif text-2xl font-bold tracking-wider text-white">
            Cine<span className="text-primary">Mate</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation("/search")}
          className="text-white hover:text-primary hover:bg-white/5"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
