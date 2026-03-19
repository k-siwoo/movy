import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { imageUrl } from "../lib/tmdb";
import type { Movie } from "../types/tmdb";

const Card = styled.article`
  display: grid;
  gap: 12px;
`;

const PosterWrap = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const PosterLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  background: var(--panel);
`;

const EmptyPoster = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  display: grid;
  place-content: center;
  background: var(--panel);
  color: #7f87a1;
  font-size: 2rem;
`;

const FavoriteButton = styled.button<{ active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 999px;
  background: ${({ active }) =>
    active ? "rgba(226, 93, 87, 0.22)" : "rgba(8, 9, 13, 0.72)"};
  color: ${({ active }) => (active ? "#ff7b73" : "rgba(245, 247, 251, 0.7)")};
  cursor: pointer;
`;

const HeartIcon = styled.svg<{ active: boolean }>`
  width: 16px;
  height: 16px;
  display: block;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: ${({ active }) => (active ? "currentColor" : "none")};
`;

const Body = styled.div`
  display: grid;
  gap: 8px;
`;

const TitleLink = styled(Link)`
  color: var(--text);
  text-decoration: none;
  font-weight: 700;
  line-height: 1.35;
  min-height: calc(1.35em * 2);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.p`
  color: var(--muted);
  font-size: 0.95rem;
`;

const Star = styled.span`
  color: var(--accent);
  font-weight: 700;
`;

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  return (
    <Card>
      <PosterWrap>
        <PosterLink to={`/movie/${movie.id}`}>
          {movie.poster_path ? (
            <Poster src={imageUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
          ) : (
            <EmptyPoster>🎬</EmptyPoster>
          )}
        </PosterLink>
        <FavoriteButton
          type="button"
          active={isFavorite}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleFavorite(movie);
          }}
          aria-label={isFavorite ? "찜 삭제" : "찜 추가"}
          title={isFavorite ? "찜 삭제" : "찜 추가"}
        >
          <HeartIcon active={isFavorite} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21C12 21 3 14.7 3 8.6C3 5.5 5.4 3 8.4 3C10.1 3 11.6 3.8 12.5 5.1C13.4 3.8 14.9 3 16.6 3C19.6 3 22 5.5 22 8.6C22 14.7 13 21 13 21H12Z" />
          </HeartIcon>
        </FavoriteButton>
      </PosterWrap>
      <Body>
        <TitleLink to={`/movie/${movie.id}`}>{movie.title}</TitleLink>
        <Meta>
          <Star>★ {movie.vote_average.toFixed(1)}</Star> · {movie.release_date || "-"}
        </Meta>
      </Body>
    </Card>
  );
}
