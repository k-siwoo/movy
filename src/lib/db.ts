import { openDB } from "idb";

const HISTORY_LIMIT = 30;

export interface StoredMovie {
  movieId: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
}

export interface FavoriteMovie extends StoredMovie {
  savedAt: string;
}

export interface HistoryMovie extends StoredMovie {
  viewedAt: string;
}

interface MovieDB {
  favorites: {
    key: number;
    value: FavoriteMovie;
  };
  history: {
    key: number;
    value: HistoryMovie;
  };
}

const dbPromise = openDB<MovieDB>("movie-app-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("favorites")) {
      db.createObjectStore("favorites", { keyPath: "movieId" });
    }
    if (!db.objectStoreNames.contains("history")) {
      db.createObjectStore("history", { keyPath: "movieId" });
    }
  },
});

export async function getFavorites(): Promise<FavoriteMovie[]> {
  const db = await dbPromise;
  const items = await db.getAll("favorites");
  return items.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export async function upsertFavorite(movie: StoredMovie): Promise<void> {
  const db = await dbPromise;
  await db.put("favorites", {
    ...movie,
    savedAt: new Date().toISOString(),
  });
}

export async function removeFavorite(movieId: number): Promise<void> {
  const db = await dbPromise;
  await db.delete("favorites", movieId);
}

export async function clearFavorites(): Promise<void> {
  const db = await dbPromise;
  await db.clear("favorites");
}

export async function getHistory(): Promise<HistoryMovie[]> {
  const db = await dbPromise;
  const items = await db.getAll("history");
  return items.sort((a, b) => b.viewedAt.localeCompare(a.viewedAt));
}

export async function upsertHistory(movie: StoredMovie): Promise<void> {
  const db = await dbPromise;

  await db.put("history", {
    ...movie,
    viewedAt: new Date().toISOString(),
  });

  const items = await db.getAll("history");
  const staleItems = items
    .sort((a, b) => b.viewedAt.localeCompare(a.viewedAt))
    .slice(HISTORY_LIMIT);

  await Promise.all(staleItems.map((item) => db.delete("history", item.movieId)));
}

export async function removeHistory(movieId: number): Promise<void> {
  const db = await dbPromise;
  await db.delete("history", movieId);
}

export async function clearHistory(): Promise<void> {
  const db = await dbPromise;
  await db.clear("history");
}
