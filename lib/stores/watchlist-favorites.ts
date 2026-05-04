"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MetalSymbol } from "@/types/metals";

type WatchlistFavoritesState = {
  favorites: MetalSymbol[];
  addFavorite: (symbol: MetalSymbol) => void;
  removeFavorite: (symbol: MetalSymbol) => void;
};

export const useWatchlistFavorites = create<WatchlistFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (symbol) => {
        const { favorites } = get();
        if (favorites.includes(symbol)) return;
        set({ favorites: [...favorites, symbol] });
      },
      removeFavorite: (symbol) => {
        set({ favorites: get().favorites.filter((s) => s !== symbol) });
      },
    }),
    { name: "tpmi-watchlist-favorites" },
  ),
);
