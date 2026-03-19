import styled from "@emotion/styled";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { useSearchMovies } from "../features/movie/queries";
import { useAutoFillGrid } from "../hooks/useAutoFillGrid";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useLibraryStore } from "../stores/libraryStore";

const Page = styled.section`
  display: grid;
  gap: 28px;
  padding-top: 34px;
`;

const Header = styled.div`
  width: min(760px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.7rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
`;

const Icon = styled.span`
  color: var(--muted);
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 1rem;

  &::placeholder {
    color: var(--muted);
  }
`;

const StateText = styled.p`
  margin: 100px 0 0;
  text-align: center;
  color: var(--muted);
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

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const debounced = useDebouncedValue(search, 300);
  const query = useSearchMovies(debounced);
  const { favorites, loadFavorites, toggleFavoriteFromMovie } = useLibraryStore();

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const favoriteIds = new Set(favorites.map((item) => item.movieId));
  const movies = useMemo(
    () => query.data?.pages.flatMap((page) => page.results) ?? [],
    [query.data],
  );
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
        <Title>영화 검색</Title>
        <SearchBox>
          <Icon>⌕</Icon>
          <Input
            type="text"
            placeholder="영화 제목을 입력하세요"
            value={search}
            onChange={(event) => {
              const next = event.target.value;
              const params = new URLSearchParams(searchParams);

              if (next.trim()) {
                params.set("q", next);
              } else {
                params.delete("q");
              }

              setSearchParams(params);
            }}
          />
        </SearchBox>
      </Header>

      {!debounced && <StateText>검색어를 입력하면 영화를 찾아드립니다</StateText>}
      {query.isLoading && <StateText>검색 중입니다</StateText>}
      {query.isError && <StateText>검색 결과를 불러오지 못했습니다</StateText>}
      {debounced && !query.isLoading && !query.isError && movies.length === 0 && (
        <StateText>조건을 만족하는 영화가 없습니다</StateText>
      )}

      {movies.length > 0 && (
        <>
          <div ref={gridRef}>
            <MovieGrid
              movies={movies}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavoriteFromMovie}
            />
          </div>

          {query.hasNextPage && (
            <LoadMoreButton
              type="button"
              onClick={() => query.fetchNextPage()}
              disabled={query.isFetchingNextPage}
            >
              {query.isFetchingNextPage ? "불러오는 중" : "더 불러오기"}
            </LoadMoreButton>
          )}
        </>
      )}
    </Page>
  );
}
