import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Hero = styled.section`
  min-height: calc(100dvh - 148px);
  display: grid;
  place-items: center;
`;

const HeroInner = styled.div`
  width: min(720px, 100%);
  display: grid;
  justify-items: center;
  gap: 22px;
  text-align: center;
`;

const Badge = styled.div`
  padding: 10px 16px;
  border: 1px solid rgba(242, 191, 89, 0.25);
  border-radius: 999px;
  background: rgba(242, 191, 89, 0.08);
  color: var(--accent);
  font-weight: 700;
`;

const Title = styled.h1`
  font-size: clamp(3.6rem, 8vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
`;

const Accent = styled.span`
  color: var(--accent);
`;

const Description = styled.p`
  max-width: 360px;
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.7;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 138px;
  padding: 14px 22px;
  border-radius: 12px;
  background: var(--accent);
  color: #121212;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 12px 40px rgba(242, 191, 89, 0.18);
`;

export function HomePage() {
  return (
    <Hero>
      <HeroInner>
        <Badge>TMDB 기반 추천</Badge>
        <Title>
          지금 이 순간에
          <br />
          딱 맞는 <Accent>영화</Accent>
        </Title>
        <Description>
          무드와 상황을 선택하면
          <br />
          취향에 맞는 영화를 추천합니다.
        </Description>
        <Button to="/movie">추천 받기</Button>
      </HeroInner>
    </Hero>
  );
}
