import { create } from "zustand";
import type { Movie } from "../types/tmdb";
import {
  clearFavorites,
  clearHistory,
  getFavorites,
  getHistory,
  removeFavorite,
  removeHistory,
  upsertFavorite,
  upsertHistory,
  type FavoriteMovie,
  type HistoryMovie,
  type StoredMovie,
} from "../lib/db";

interface LibraryState {
  favorites: FavoriteMovie[];
  history: HistoryMovie[];
  loadFavorites: () => Promise<void>;
  loadHistory: () => Promise<void>;
  toggleFavoriteFromMovie: (movie: Movie) => Promise<void>;
  removeFavoriteById: (movieId: number) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
  upsertHistoryFromMovie: (movie: Movie) => Promise<void>;
  removeHistoryById: (movieId: number) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

function mapMovie(movie: Movie): StoredMovie {
  return {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    voteAverage: movie.vote_average,
    releaseDate: movie.release_date,
  };
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  favorites: [],
  history: [],
  loadFavorites: async () => {
    const favorites = await getFavorites();
    set({ favorites });
  },
  loadHistory: async () => {
    const history = await getHistory();
    set({ history });
  },
  toggleFavoriteFromMovie: async (movie) => {
    const exists = get().favorites.some((item) => item.movieId === movie.id);
    if (exists) {
      await removeFavorite(movie.id);
    } else {
      await upsertFavorite(mapMovie(movie));
    }
    await get().loadFavorites();
  },
  removeFavoriteById: async (movieId) => {
    await removeFavorite(movieId);
    await get().loadFavorites();
  },
  clearAllFavorites: async () => {
    await clearFavorites();
    await get().loadFavorites();
  },
  upsertHistoryFromMovie: async (movie) => {
    await upsertHistory(mapMovie(movie));
    await get().loadHistory();
  },
  removeHistoryById: async (movieId) => {
    await removeHistory(movieId);
    await get().loadHistory();
  },
  clearAllHistory: async () => {
    await clearHistory();
    await get().loadHistory();
  },
  isFavorite: (movieId) => get().favorites.some((item) => item.movieId === movieId),
}));
