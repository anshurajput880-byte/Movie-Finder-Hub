import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@workspace/api-client-react";

const KEY = "cinemate_watchlist";

export function useWatchlist() {
  const [list, setList] = useState<MediaItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  const save = useCallback((items: MediaItem[]) => {
    setList(items);
    localStorage.setItem(KEY, JSON.stringify(items));
  }, []);

  const add = useCallback((item: MediaItem) => {
    setList(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      const next = [item, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setList(prev => {
      const next = prev.filter(i => i.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggle = useCallback((item: MediaItem) => {
    setList(prev => {
      const exists = prev.find(i => i.id === item.id);
      const next = exists ? prev.filter(i => i.id !== item.id) : [item, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isInList = useCallback((id: number) => list.some(i => i.id === id), [list]);

  return { list, add, remove, toggle, isInList, save };
}
