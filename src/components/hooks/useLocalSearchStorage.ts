import { FilterDto } from "@/lib/validation/all.schema";
import { useCallback } from "react";

type SearchHistory = {
  filters: FilterDto;
  searchedAt:string
};

type Search = {
  title: string;
  filters: FilterDto;
  searchedAt:string
};

type ViewedAd = {
  id: number;
  viewedAt: string;
};

export function useLocalSearchStorage() {
  const MAX_ENTRIES = 10;

  const getFromStorage = (key: string) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  };

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data.slice(0, MAX_ENTRIES)));
  };


  const getSearchHistory = useCallback((): SearchHistory[] => {
    return getFromStorage("search_history");
  }, []);
  
  const saveSearchHistory = useCallback((filters: FilterDto) => {
    const history: SearchHistory[] = getFromStorage("search_history");

    const isDuplicate = history.some(
        (entry) => JSON.stringify(entry.filters) === JSON.stringify(filters)
    );

    if (isDuplicate) return;

    const newEntry = { filters, searchedAt: new Date().toISOString() };
    saveToStorage("search_history", [newEntry, ...history]);
    }, []);

    const saveSearch = useCallback((filters: FilterDto,title:string) => {
    const searchList: Search[] = getFromStorage("search");

    const isDuplicate = searchList.some(
        (entry) => JSON.stringify(entry.filters) === JSON.stringify(filters)
    );

    if (isDuplicate) return;

    const newEntry = { filters, searchedAt: new Date().toISOString(), title };
    saveToStorage("search", [newEntry, ...searchList]);
    }, []);

  const getSearch = useCallback((): Search[] => {
    return getFromStorage("search");
  }, []);

  const saveViewedAd = useCallback((id:number) => {
    const ads: ViewedAd[] = getFromStorage("recent_ads");
    const filtered = ads.filter((a) => a.id !== id);
    saveToStorage("recent_ads", [{ id:id, viewedAt: new Date().toISOString() }, ...filtered]);
  }, []);

  const getRecentAds = useCallback((): ViewedAd[] => {
    return getFromStorage("recent_ads");
  }, []);

  const clearAll = () => {
    localStorage.removeItem("search_history");
    localStorage.removeItem("recent_ads");
  };

  return {
    saveSearch,
    getSearch,
    saveSearchHistory,
    getSearchHistory,
    saveViewedAd,
    getRecentAds,
    clearAll,
  };
}
