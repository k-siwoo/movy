import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { useSearchMovies } from "../features/movie/queries";
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
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [gridTop, setGridTop] = useState(0);
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(380);
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
  const minimumMoviesForViewport = useMemo(() => {
    if (gridWidth <= 0) {
      return 20;
    }

    const estimatedColumns = Math.max(1, Math.floor((gridWidth + 20) / 240));
    const visibleHeight = Math.max(0, viewportHeight - gridTop - 24);
    const estimatedRows = Math.max(1, Math.ceil(visibleHeight / estimatedRowHeight));

    return estimatedColumns * estimatedRows;
  }, [estimatedRowHeight, gridTop, gridWidth, viewportHeight]);

  useEffect(() => {
    const target = gridRef.current;

    if (!target || movies.length === 0) {
      return undefined;
    }

    const updateMetrics = () => {
      setGridWidth(target.clientWidth);
      setGridTop(target.getBoundingClientRect().top);
      setViewportHeight(window.innerHeight);

      const firstCard = target.querySelector("article");
      if (firstCard instanceof HTMLElement) {
        const styles = window.getComputedStyle(target.firstElementChild ?? target);
        const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0");
        setEstimatedRowHeight(firstCard.getBoundingClientRect().height + rowGap);
      }
    };

    updateMetrics();

    const observer = new ResizeObserver(() => {
      updateMetrics();
    });

    observer.observe(target);
    if (target.firstElementChild instanceof HTMLElement) {
      observer.observe(target.firstElementChild);
    }

    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", updateMetrics, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", updateMetrics);
    };
  }, [movies.length]);

  useEffect(() => {
    if (!debounced || movies.length === 0) {
      return;
    }

    if (!query.hasNextPage || query.isFetchingNextPage || query.isLoading) {
      return;
    }

    if (movies.length >= minimumMoviesForViewport) {
      return;
    }

    void query.fetchNextPage();
  }, [debounced, minimumMoviesForViewport, movies.length, query]);

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
