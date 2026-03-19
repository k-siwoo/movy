import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { useDiscoverMovies } from "../features/movie/queries";
import { scenarioLabels, type ScenarioKey } from "../features/movie/scenarios";
import { useLibraryStore } from "../stores/libraryStore";

const ottOptions = [
  { key: "", label: "전체" },
  { key: "8", label: "Netflix" },
  { key: "97", label: "Watcha" },
  { key: "337", label: "Disney+" },
  { key: "350", label: "TVING" },
  { key: "356", label: "wavve" },
];

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

const FilterGroup = styled.div`
  display: grid;
  gap: 12px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.button<{ active: boolean }>`
  border-radius: 999px;
  border: 1px solid ${({ active }) => (active ? "rgba(242, 191, 89, 0.45)" : "var(--border)")};
  background: ${({ active }) => (active ? "rgba(242, 191, 89, 0.12)" : "var(--panel)")};
  color: ${({ active }) => (active ? "var(--accent)" : "var(--muted)")};
  padding: 10px 16px;
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    color 150ms ease,
    transform 150ms ease,
    background 150ms ease;

  &:hover {
    color: var(--text);
    border-color: rgba(242, 191, 89, 0.28);
    transform: translateY(-1px);
  }
`;

const OttChip = styled(Chip)`
  border-radius: 10px;
  padding: 10px 14px;
`;

const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const SelectWrap = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.95rem;
`;

const Select = styled.select`
  height: 40px;
  min-width: 96px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  padding: 0 12px;
  outline: none;
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

function parseScenario(value: string | null): ScenarioKey | undefined {
  if (!value) {
    return undefined;
  }

  const isValid = scenarioLabels.some((item) => item.key === value);
  return isValid ? (value as ScenarioKey) : undefined;
}

export function MoviePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [gridTop, setGridTop] = useState(0);
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(380);
  const scenario = parseScenario(searchParams.get("scenario"));
  const language = searchParams.get("lang") || "";
  const ott =
    searchParams
      .get("ott")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  const { favorites, loadFavorites, toggleFavoriteFromMovie } = useLibraryStore();

  const query = useDiscoverMovies({
    scenario,
    language: language || undefined,
    ott: ott.length ? ott : undefined,
  });

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const target = gridRef.current;

    if (!target) {
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
  }, []);

  const movies = query.data?.pages.flatMap((page) => page.results) ?? [];
  const favoriteIds = new Set(favorites.map((item) => item.movieId));
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
    if (!movies.length) {
      return;
    }

    if (!query.hasNextPage || query.isFetchingNextPage || query.isLoading) {
      return;
    }

    if (movies.length >= minimumMoviesForViewport) {
      return;
    }

    void query.fetchNextPage();
  }, [
    minimumMoviesForViewport,
    movies.length,
    query,
  ]);

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  return (
    <Page>
      <Header>
        <Title>지금 끌리는 영화</Title>
        <FilterGroup>
          <ChipRow>
            {scenarioLabels.map((item) => (
              <Chip
                key={item.key}
                type="button"
                active={item.key === scenario}
                onClick={() => updateParam("scenario", item.key === scenario ? undefined : item.key)}
              >
                {item.label}
              </Chip>
            ))}
          </ChipRow>

          <ChipRow>
            {ottOptions.map((item) => (
              <OttChip
                key={item.key || "all"}
                type="button"
                active={item.key === "" ? ott.length === 0 : ott.includes(item.key)}
                onClick={() => {
                  if (item.key === "") {
                    updateParam("ott", undefined);
                    return;
                  }

                  const next = ott.includes(item.key)
                    ? ott.filter((value) => value !== item.key)
                    : [...ott, item.key];

                  updateParam("ott", next.length ? next.join(",") : undefined);
                }}
              >
                {item.label}
              </OttChip>
            ))}
          </ChipRow>

          <ControlRow>
            <SelectWrap htmlFor="language">
              <span>언어</span>
              <Select
                id="language"
                value={language}
                onChange={(event) => updateParam("lang", event.target.value || undefined)}
              >
                <option value="">전체</option>
                <option value="ko">한국어</option>
                <option value="en">영어</option>
                <option value="ja">일본어</option>
              </Select>
            </SelectWrap>
          </ControlRow>
        </FilterGroup>
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
