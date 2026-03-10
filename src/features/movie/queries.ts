import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { buildDiscoverParams, type ScenarioKey } from "./scenarios";
import {
  discoverMovies,
  getMovieDetail,
  getSimilarMovies,
  getWatchProviders,
  searchMovies,
} from "../../lib/tmdb";

interface DiscoverInput {
  scenario?: ScenarioKey;
  language?: string;
  adult: boolean;
}

export function useDiscoverMovies(filters: DiscoverInput) {
  return useInfiniteQuery({
    queryKey: ["discoverMovies", filters.scenario ?? "all", filters.language ?? "", filters.adult],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      discoverMovies(
        buildDiscoverParams({
          page: pageParam,
          scenario: filters.scenario,
          language: filters.language,
          adult: filters.adult,
        }),
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
}

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ["searchMovies", query],
    queryFn: () => searchMovies(query),
    enabled: query.trim().length > 0,
  });
}

export function useMovieDetail(movieId: number) {
  return useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isFinite(movieId),
  });
}

export function useWatchProviders(movieId: number) {
  return useQuery({
    queryKey: ["watchProviders", movieId],
    queryFn: () => getWatchProviders(movieId),
    enabled: Number.isFinite(movieId),
  });
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ["similarMovies", movieId],
    queryFn: () => getSimilarMovies(movieId),
    enabled: Number.isFinite(movieId),
  });
}
