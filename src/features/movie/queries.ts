import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { buildDiscoverParams, type ScenarioKey } from "./scenarios";
import {
  discoverMovies,
  getMovieDetail,
  getMovieReleaseDates,
  getSimilarMovies,
  getWatchProviders,
  nowPlayingMovies,
  searchMovies,
} from "../../lib/tmdb";

interface DiscoverInput {
  scenario?: ScenarioKey;
  language?: string;
  adult: boolean;
  ott?: string[];
  country?: string;
  nowPlaying: boolean;
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
      filters.nowPlaying,
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      if (filters.nowPlaying) {
        return nowPlayingMovies(pageParam, filters.country || "KR");
      }

      return discoverMovies(
        buildDiscoverParams({
          page: pageParam,
          scenario: filters.scenario,
          language: filters.language,
          adult: filters.adult,
          ott: filters.ott,
          country: filters.country,
        }),
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
}

// 검색 페이지 영화 검색 쿼리 훅
export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ["searchMovies", query],
    queryFn: () => searchMovies(query),
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
    queryFn: () => getSimilarMovies(movieId),
    enabled: Number.isFinite(movieId),
  });
}

// 영화 국가별 개봉일 정보 조회 쿼리 훅
export function useMovieReleaseDates(movieId: number) {
  return useQuery({
    queryKey: ["movieReleaseDates", movieId],
    queryFn: () => getMovieReleaseDates(movieId),
    enabled: Number.isFinite(movieId),
  });
}
