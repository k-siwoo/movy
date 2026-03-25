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

// 브라우저 IndexedDB 초기화와 스토어 생성
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

// 찜 목록 전체 조회 함수
export async function getFavorites(): Promise<FavoriteMovie[]> {
  const db = await dbPromise;
  const items = await db.getAll("favorites");
  return items.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

// 찜 목록 저장 및 갱신 함수
export async function upsertFavorite(movie: StoredMovie): Promise<void> {
  const db = await dbPromise;
  await db.put("favorites", {
    ...movie,
    savedAt: new Date().toISOString(),
  });
}

// 찜 목록 개별 삭제 함수
export async function removeFavorite(movieId: number): Promise<void> {
  const db = await dbPromise;
  await db.delete("favorites", movieId);
}

// 최근 본 목록 전체 조회 함수
export async function getHistory(): Promise<HistoryMovie[]> {
  const db = await dbPromise;
  const items = await db.getAll("history");
  return items.sort((a, b) => b.viewedAt.localeCompare(a.viewedAt));
}

// 최근 본 목록 저장 및 최대 개수 유지 함수
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
