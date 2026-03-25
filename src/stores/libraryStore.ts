import { create } from "zustand";
import type { Movie } from "../types/tmdb";
import {
  getFavorites,
  getHistory,
  removeFavorite,
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
  upsertHistoryFromMovie: (movie: Movie) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

// 영화 타입을 변환 함수
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
  upsertHistoryFromMovie: async (movie) => {
    await upsertHistory(mapMovie(movie));
    await get().loadHistory();
  },
  isFavorite: (movieId) =>
    get().favorites.some((item) => item.movieId === movieId),
}));
