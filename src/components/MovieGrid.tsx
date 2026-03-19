import styled from "@emotion/styled";
import type { Movie } from "../types/tmdb";
import { MovieCard } from "./MovieCard";

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px 20px;
`;

interface MovieGridProps {
  movies: Movie[];
  favoriteIds: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
}

export function MovieGrid({ movies, favoriteIds, onToggleFavorite }: MovieGridProps) {
  return (
    <Grid>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favoriteIds.has(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Grid>
  );
}
