import type {
  Movie,
  MovieDetail,
  MovieReleaseDatesResponse,
  PagedResponse,
  WatchProvidersResponse,
} from "../types/tmdb";
import type { DiscoverParams } from "../features/movie/scenarios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_KEY) {
  console.warn("VITE_TMDB_API_KEY is not set.");
}

// TMDB 요청 파라미터 쿼리스트링 변환 함수
function toQueryString(params: object) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean")
    ) {
      query.set(key, String(value));
    }
  });
  return query.toString();
}

// TMDB 공통 요청 함수
async function tmdbFetch<T>(path: string, params: object = {}): Promise<T> {
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

// 포스터 이미지 주소 함수
export function imageUrl(path: string | null): string {
  return path ? `${TMDB_IMAGE_BASE}${path}` : "";
}

// 추천 페이지 Discover 목록 조회 함수
export function discoverMovies(
  params: DiscoverParams,
): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>("/discover/movie", params);
}

// 상영중 목록 조회 함수
export function nowPlayingMovies(
  page = 1,
  region = "KR",
): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>("/movie/now_playing", {
    page,
    region,
  });
}

// 검색 페이지 영화 검색 함수
export function searchMovies(
  query: string,
  page = 1,
): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>("/search/movie", {
    query,
    page,
    include_adult: false,
  });
}

// 영화 상세 정보 조회 함수
export function getMovieDetail(movieId: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${movieId}`);
}

// 영화별 OTT 조회 함수
export function getWatchProviders(
  movieId: number,
): Promise<WatchProvidersResponse> {
  return tmdbFetch<WatchProvidersResponse>(
    `/movie/${movieId}/watch/providers`,
    {
      language: undefined,
    },
  );
}

// 영화 상세 페이지 추천 영화 조회 함수
export function getSimilarMovies(
  movieId: number,
  page = 1,
): Promise<PagedResponse<Movie>> {
  return tmdbFetch<PagedResponse<Movie>>(`/movie/${movieId}/similar`, { page });
}

// 국가별 개봉일 조회 함수
export function getMovieReleaseDates(
  movieId: number,
): Promise<MovieReleaseDatesResponse> {
  return tmdbFetch<MovieReleaseDatesResponse>(
    `/movie/${movieId}/release_dates`,
    {
      language: undefined,
    },
  );
}
