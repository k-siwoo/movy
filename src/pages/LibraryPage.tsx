import styled from "@emotion/styled";
import { useEffect, type WheelEvent } from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../lib/tmdb";
import { useLibraryStore } from "../stores/libraryStore";
import type { Movie } from "../types/tmdb";

const Page = styled.section`
  display: grid;
  gap: 42px;
  padding-top: 30px;
`;

const Section = styled.section`
  display: grid;
  gap: 18px;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.9rem;
  letter-spacing: -0.03em;
`;

const Count = styled.span`
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--muted);
  background: var(--panel);
  font-size: 0.85rem;
`;

const Track = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  overscroll-behavior-x: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.article`
  flex: 0 0 148px;
  display: grid;
  gap: 10px;
`;

const PosterLink = styled(Link)`
  position: relative;
  display: block;
  color: inherit;
  text-decoration: none;
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 16px;
  background: var(--panel-strong);
  box-shadow: 0 0 0 1px var(--border);
`;

const EmptyPoster = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--panel-strong);
  color: var(--muted);
  box-shadow: 0 0 0 1px var(--border);
  font-size: 2rem;
`;

const FavoriteButton = styled.button<{ active: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 0;
  background: ${({ active }) =>
    active ? "rgba(224, 90, 90, 0.95)" : "rgba(9, 10, 14, 0.78)"};
  color: ${({ active }) => (active ? "#fff4f4" : "rgba(255,255,255,0.7)")};
  cursor: pointer;
`;

const HeartIcon = styled.svg<{ active: boolean }>`
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: ${({ active }) => (active ? "currentColor" : "none")};
`;

const MovieTitle = styled(Link)`
  color: var(--text);
  text-decoration: none;
  font-weight: 700;
  line-height: 1.35;
  min-height: calc(1.35em * 2);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const Meta = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
`;

const EmptyText = styled.p`
  margin: 0;
  color: var(--muted);
`;

function toMovie(item: {
  movieId: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
}): Movie {
  return {
    id: item.movieId,
    title: item.title,
    poster_path: item.posterPath,
    vote_average: item.voteAverage,
    release_date: item.releaseDate,
    overview: "",
  };
}

function handleHorizontalWheel(event: WheelEvent<HTMLDivElement>) {
  const target = event.currentTarget;
  if (target.scrollWidth <= target.clientWidth) {
    return;
  }

  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
    return;
  }

  event.preventDefault();
  target.scrollLeft += event.deltaY;
}

export function LibraryPage() {
  const {
    favorites,
    history,
    loadFavorites,
    loadHistory,
    toggleFavoriteFromMovie,
    isFavorite,
  } = useLibraryStore();

  useEffect(() => {
    void loadFavorites();
    void loadHistory();
  }, [loadFavorites, loadHistory]);

  return (
    <Page>
      <Section>
        <Header>
          <Title>찜 목록</Title>
          <Count>{favorites.length}</Count>
        </Header>
        {favorites.length === 0 ? (
          <EmptyText>아직 찜한 영화가 없다.</EmptyText>
        ) : (
          <Track onWheel={handleHorizontalWheel}>
            {favorites.map((movie) => (
              <Card key={movie.movieId}>
                <PosterLink to={`/movie/${movie.movieId}`}>
                  {movie.posterPath ? (
                    <Poster src={imageUrl(movie.posterPath)} alt={movie.title} loading="lazy" />
                  ) : (
                    <EmptyPoster>🎬</EmptyPoster>
                  )}
                  <FavoriteButton
                    type="button"
                    active
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void toggleFavoriteFromMovie(toMovie(movie));
                    }}
                    aria-label="찜 해제"
                  >
                    <HeartIcon active viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21C12 21 3 14.7 3 8.6C3 5.5 5.4 3 8.4 3C10.1 3 11.6 3.8 12.5 5.1C13.4 3.8 14.9 3 16.6 3C19.6 3 22 5.5 22 8.6C22 14.7 13 21 13 21H12Z" />
                    </HeartIcon>
                  </FavoriteButton>
                </PosterLink>
                <MovieTitle to={`/movie/${movie.movieId}`}>{movie.title}</MovieTitle>
                <Meta>{movie.releaseDate || "-"}</Meta>
              </Card>
            ))}
          </Track>
        )}
      </Section>

      <Section>
        <Header>
          <Title>최근 본 목록</Title>
          <Count>{history.length}</Count>
        </Header>
        {history.length === 0 ? (
          <EmptyText>최근 본 영화가 없다.</EmptyText>
        ) : (
          <Track onWheel={handleHorizontalWheel}>
            {history.map((movie) => {
              const active = isFavorite(movie.movieId);
              return (
                <Card key={movie.movieId}>
                  <PosterLink to={`/movie/${movie.movieId}`}>
                    {movie.posterPath ? (
                      <Poster src={imageUrl(movie.posterPath)} alt={movie.title} loading="lazy" />
                    ) : (
                      <EmptyPoster>🎬</EmptyPoster>
                    )}
                    <FavoriteButton
                      type="button"
                      active={active}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void toggleFavoriteFromMovie(toMovie(movie));
                      }}
                      aria-label={active ? "찜 해제" : "찜 추가"}
                    >
                      <HeartIcon active={active} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21C12 21 3 14.7 3 8.6C3 5.5 5.4 3 8.4 3C10.1 3 11.6 3.8 12.5 5.1C13.4 3.8 14.9 3 16.6 3C19.6 3 22 5.5 22 8.6C22 14.7 13 21 13 21H12Z" />
                      </HeartIcon>
                    </FavoriteButton>
                  </PosterLink>
                  <MovieTitle to={`/movie/${movie.movieId}`}>{movie.title}</MovieTitle>
                  <Meta>{movie.releaseDate || "-"}</Meta>
                </Card>
              );
            })}
          </Track>
        )}
      </Section>
    </Page>
  );
}
