import styled from "@emotion/styled";
import { useEffect, type WheelEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useMovieDetail,
  useSimilarMovies,
  useWatchProviders,
} from "../features/movie/queries";
import { imageUrl } from "../lib/tmdb";
import { useLibraryStore } from "../stores/libraryStore";

const Page = styled.section`
  display: grid;
  gap: 32px;
  padding-top: 22px;
`;

const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    color: var(--text);
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 40px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PosterWrap = styled.div`
  position: relative;
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 18px;
  background: var(--panel-strong);
  box-shadow: 0 0 0 1px var(--border);
`;

const EmptyPoster = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: var(--panel-strong);
  box-shadow: 0 0 0 1px var(--border);
  color: var(--muted);
  font-size: 2.3rem;
`;

const Info = styled.div`
  display: grid;
  gap: 16px;
  align-content: start;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
`;

const GenreRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreChip = styled.span`
  height: 28px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
`;

const Meta = styled.div`
  display: flex;
  align-items: end;
  gap: 12px;
  flex-wrap: wrap;
`;

const Score = styled.span`
  font-size: 3rem;
  line-height: 1;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.05em;
`;

const MetaText = styled.div`
  color: var(--muted);
  line-height: 1.4;
`;

const Overview = styled.p`
  margin: 0;
  max-width: 760px;
  color: rgba(239, 242, 251, 0.82);
  line-height: 1.8;
  font-size: 1.03rem;
`;

const FavoriteButton = styled.button<{ active: boolean }>`
  width: fit-content;
  height: 48px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid ${({ active }) => (active ? "rgba(224, 90, 90, 0.38)" : "var(--border)")};
  background: ${({ active }) => (active ? "rgba(224, 90, 90, 0.08)" : "transparent")};
  color: ${({ active }) => (active ? "#ff6d6d" : "var(--text)")};
  cursor: pointer;
  font-size: 1rem;
`;

const HeartIcon = styled.svg<{ active: boolean }>`
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: ${({ active }) => (active ? "currentColor" : "none")};
`;

const Panel = styled.section`
  padding: 24px 24px 26px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(22, 24, 30, 0.72);
  display: grid;
  gap: 18px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  color: var(--muted);
`;

const ProviderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ProviderColumn = styled.div`
  padding-left: 18px;
  border-left: 1px solid var(--border);
  display: grid;
  gap: 10px;

  &:first-of-type {
    padding-left: 0;
    border-left: 0;
  }

  @media (max-width: 900px) {
    padding-left: 0;
    border-left: 0;
    padding-top: 18px;
    border-top: 1px solid var(--border);

    &:first-of-type {
      padding-top: 0;
      border-top: 0;
    }
  }
`;

const ProviderLabel = styled.h3`
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 500;
`;

const ProviderText = styled.p`
  margin: 0;
  color: var(--text);
  line-height: 1.7;
`;

const SimilarTrack = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0 6px;
  overscroll-behavior-x: contain;
`;

const SimilarCard = styled.article`
  flex: 0 0 112px;
  display: grid;
  gap: 10px;
`;

const SimilarLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const SimilarPoster = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 14px;
  background: var(--panel-strong);
`;

const EmptySimilarPoster = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--panel-strong);
  color: var(--muted);
  font-size: 1.5rem;
`;

const SimilarTitle = styled(Link)`
  color: var(--muted);
  text-decoration: none;
  line-height: 1.45;
  font-size: 0.92rem;
  min-height: calc(1.45em * 2);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const StateText = styled.p`
  margin: 0;
  color: var(--muted);
`;

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

export function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const detail = useMovieDetail(movieId);
  const providers = useWatchProviders(movieId);
  const similar = useSimilarMovies(movieId);
  const { isFavorite, toggleFavoriteFromMovie, upsertHistoryFromMovie, loadFavorites } =
    useLibraryStore();

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (detail.data) {
      void upsertHistoryFromMovie(detail.data);
    }
  }, [detail.data, upsertHistoryFromMovie]);

  if (detail.isLoading) {
    return <StateText>영화 정보를 불러오는 중이다.</StateText>;
  }

  if (!detail.data) {
    return <StateText>영화 정보를 찾을 수 없다.</StateText>;
  }

  const providerKR = providers.data?.results?.KR;
  const favorite = isFavorite(detail.data.id);

  return (
    <Page>
      <BackLink to="/movie">‹ 목록으로</BackLink>

      <Hero>
        <PosterWrap>
          {detail.data.poster_path ? (
            <Poster src={imageUrl(detail.data.poster_path)} alt={detail.data.title} />
          ) : (
            <EmptyPoster>🎬</EmptyPoster>
          )}
        </PosterWrap>

        <Info>
          <Title>{detail.data.title}</Title>

          <GenreRow>
            {detail.data.genres.map((genre) => (
              <GenreChip key={genre.id}>{genre.name}</GenreChip>
            ))}
          </GenreRow>

          <Meta>
            <Score>{detail.data.vote_average.toFixed(1)}</Score>
            <MetaText>
              <div>TMDB</div>
              <div>{detail.data.release_date || "-"} 개봉</div>
            </MetaText>
          </Meta>

          <Overview>{detail.data.overview || "줄거리 정보가 없다."}</Overview>

          <FavoriteButton
            type="button"
            active={favorite}
            onClick={() => void toggleFavoriteFromMovie(detail.data)}
          >
            <HeartIcon active={favorite} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21C12 21 3 14.7 3 8.6C3 5.5 5.4 3 8.4 3C10.1 3 11.6 3.8 12.5 5.1C13.4 3.8 14.9 3 16.6 3C19.6 3 22 5.5 22 8.6C22 14.7 13 21 13 21H12Z" />
            </HeartIcon>
            <span>{favorite ? "찜 해제" : "찜하기"}</span>
          </FavoriteButton>
        </Info>
      </Hero>

      <Panel>
        <PanelTitle>OTT 제공처 KR</PanelTitle>
        <ProviderGrid>
          <ProviderColumn>
            <ProviderLabel>스트리밍</ProviderLabel>
            <ProviderText>
              {providerKR?.flatrate?.map((item) => item.provider_name).join(", ") || "정보 없음"}
            </ProviderText>
          </ProviderColumn>
          <ProviderColumn>
            <ProviderLabel>대여</ProviderLabel>
            <ProviderText>
              {providerKR?.rent?.map((item) => item.provider_name).join(", ") || "정보 없음"}
            </ProviderText>
          </ProviderColumn>
          <ProviderColumn>
            <ProviderLabel>구매</ProviderLabel>
            <ProviderText>
              {providerKR?.buy?.map((item) => item.provider_name).join(", ") || "정보 없음"}
            </ProviderText>
          </ProviderColumn>
        </ProviderGrid>
      </Panel>

      <Panel>
        <PanelTitle>유사 영화</PanelTitle>
        {similar.data?.results.length ? (
          <SimilarTrack onWheel={handleHorizontalWheel}>
            {similar.data.results.map((movie) => (
              <SimilarCard key={movie.id}>
                <SimilarLink to={`/movie/${movie.id}`}>
                  {movie.poster_path ? (
                    <SimilarPoster src={imageUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
                  ) : (
                    <EmptySimilarPoster>🎬</EmptySimilarPoster>
                  )}
                </SimilarLink>
                <SimilarTitle to={`/movie/${movie.id}`}>{movie.title}</SimilarTitle>
              </SimilarCard>
            ))}
          </SimilarTrack>
        ) : (
          <StateText>유사 영화 정보가 없다.</StateText>
        )}
      </Panel>
    </Page>
  );
}
