import styled from "@emotion/styled";
import { useEffect } from "react";
import { MovieFilters } from "../components/MovieFilters";
import { MovieGrid } from "../components/MovieGrid";
import { useDiscoverMovies } from "../features/movie/queries";
import { useAutoFillGrid } from "../hooks/useAutoFillGrid";
import { useMovieFilters } from "../hooks/useMovieFilters";
import { useLibraryStore } from "../stores/libraryStore";

const Page = styled.section`
  display: grid;
  gap: 32px;
`;

const Header = styled.div`
  display: grid;
  gap: 18px;
  padding: 36px 8px 18px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.7rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
`;

const Content = styled.div`
  display: grid;
  gap: 22px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
`;

const GridWrap = styled.div`
  min-width: 0;
`;

const StateText = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.98rem;
`;

const LoadMoreButton = styled.button`
  justify-self: center;
  min-width: 180px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid rgba(242, 191, 89, 0.32);
  background: rgba(242, 191, 89, 0.1);
  color: var(--accent);
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 150ms ease,
    background 150ms ease,
    border-color 150ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(242, 191, 89, 0.16);
    border-color: rgba(242, 191, 89, 0.46);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export function MoviePage() {
  const { scenario, language, ott, updateParam } = useMovieFilters();
  const { favorites, loadFavorites, toggleFavoriteFromMovie } = useLibraryStore();
  const query = useDiscoverMovies({
    scenario,
    language: language || undefined,
    ott: ott.length ? ott : undefined,
  });

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const movies = query.data?.pages.flatMap((page) => page.results) ?? [];
  const favoriteIds = new Set(favorites.map((item) => item.movieId));
  const { gridRef } = useAutoFillGrid({
    itemCount: movies.length,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    onFetchNextPage: () => query.fetchNextPage(),
  });

  return (
    <Page>
      <Header>
        <Title>지금 끌리는 영화</Title>
        <MovieFilters
          scenario={scenario}
          language={language}
          ott={ott}
          onUpdateParam={updateParam}
        />
      </Header>

      <Content>
        {query.isLoading && <StateText>영화 목록을 불러오는 중이다.</StateText>}
        {query.isError && <StateText>영화 목록을 불러오지 못했다.</StateText>}
        {!query.isLoading && !query.isError && movies.length === 0 && (
          <StateText>조건에 맞는 영화가 없다.</StateText>
        )}

        <GridWrap ref={gridRef}>
          <MovieGrid
            movies={movies}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavoriteFromMovie}
          />
        </GridWrap>

        {query.hasNextPage && (
          <LoadMoreButton
            type="button"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
          >
            {query.isFetchingNextPage ? "불러오는 중" : "더 불러오기"}
          </LoadMoreButton>
        )}
      </Content>
    </Page>
  );
}
