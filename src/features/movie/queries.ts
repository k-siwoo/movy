import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  discoverMovies,
  getMovieDetail,
  getSimilarMovies,
  getWatchProviders,
  hasCompleteMovieInfo,
  searchMovies,
} from "../../lib/tmdb";
import { buildDiscoverParams, type ScenarioKey } from "./scenarios";

interface DiscoverInput {
  scenario?: ScenarioKey;
  language?: string;
  adult?: boolean;
  ott?: string[];
  country?: string;
}

async function filterCompleteMovies<T extends { id: number }>(movies: T[]) {
  const checks = await Promise.all(
    movies.map(async (movie) => {
      try {
        const valid = await hasCompleteMovieInfo(movie.id);
        return valid ? movie : null;
      } catch {
        return null;
      }
    }),
  );

  const filtered: T[] = [];

  checks.forEach((movie) => {
    if (movie) {
      filtered.push(movie);
    }
  });

  return filtered;
}

// 추천 페이지 무한 스크롤 목록 조회 쿼리 훅
export function useDiscoverMovies(filters: DiscoverInput) {
  return useInfiniteQuery({
    queryKey: [
      "discoverMovies",
      filters.scenario ?? "all",
      filters.language ?? "",
      filters.adult,
      filters.ott?.join(",") ?? "",
      filters.country ?? "",
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await discoverMovies(
        buildDiscoverParams({
          page: pageParam,
          scenario: filters.scenario,
          language: filters.language,
          adult: filters.adult,
          ott: filters.ott,
          country: filters.country,
        }),
      );

      const results = await filterCompleteMovies(response.results);

      return {
        ...response,
        results,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }

      return lastPage.page + 1;
    },
  });
}

// 검색 페이지 무한 스크롤 목록 조회 쿼리 훅
export function useSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: ["searchMovies", query],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await searchMovies(query, pageParam);
      const results = await filterCompleteMovies(response.results);

      return {
        ...response,
        results,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    enabled: query.trim().length > 0,
  });
}

// 영화 상세 정보 조회 쿼리 훅
export function useMovieDetail(movieId: number) {
  return useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isFinite(movieId),
  });
}

// 영화별 OTT 제공처 조회 쿼리 훅
export function useWatchProviders(movieId: number) {
  return useQuery({
    queryKey: ["watchProviders", movieId],
    queryFn: () => getWatchProviders(movieId),
    enabled: Number.isFinite(movieId),
  });
}

// 영화 상세 유사 영화 조회 쿼리 훅
export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ["similarMovies", movieId],
    queryFn: async () => {
      const response = await getSimilarMovies(movieId);
      const results = await filterCompleteMovies(response.results);

      return {
        ...response,
        results,
      };
    },
    enabled: Number.isFinite(movieId),
  });
}
