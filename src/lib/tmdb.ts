import type {
  Movie,
  MovieDetail,
  PagedResponse,
  WatchProvidersResponse,
} from "../types/tmdb";
import type { DiscoverParams } from "../features/movie/scenarios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_KEY) {
  // eslint-disable-next-line no-console
  console.warn("VITE_TMDB_API_KEY is not set.");
}

function toQueryString(params: object) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    ) {
      query.set(key, String(value));
    }
  });
  return query.toString();
}

async function tmdbFetch<T>(
  path: string,
  params: object = {},
): Promise<T> {
  const query = toQueryString({
    api_key: TMDB_KEY,
    language: "ko-KR",
    ...params,
  });

  const response = await fetch(`${TMDB_BASE_URL}${path}?${query}`);
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function imageUrl(path: string | null): string {
  return path ? `${TMDB_IMAGE_BASE}${path}` : "";
}

export function discoverMovies(params: DiscoverParams): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>("/discover/movie", params);
}

export function searchMovies(query: string, page = 1): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>("/search/movie", {
    query,
    page,
    include_adult: false,
  });
}

export function getMovieDetail(movieId: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${movieId}`);
}

export function getWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
  return tmdbFetch<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`, {
    language: undefined,
  });
}

export function getSimilarMovies(movieId: number, page = 1): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>(`/movie/${movieId}/similar`, { page });
}
