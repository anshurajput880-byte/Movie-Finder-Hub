import { useState, useCallback } from "react";

const KEY = "cinemate_continue_watching";

export interface WatchEntry {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv";
  season?: number;
  episode?: number;
  episode_name?: string;
  timestamp: number;
}

export function useContinueWatching() {
  const [entries, setEntries] = useState<WatchEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  const track = useCallback((entry: Omit<WatchEntry, "timestamp">) => {
    setEntries(prev => {
      const filtered = prev.filter(e => e.id !== entry.id);
      const next = [{ ...entry, timestamp: Date.now() }, ...filtered].slice(0, 20);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setEntries([]);
  }, []);

  return { entries, track, remove, clear };
}
