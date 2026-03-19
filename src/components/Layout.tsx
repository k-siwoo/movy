import styled from "@emotion/styled";
import { Link, NavLink, Outlet } from "react-router-dom";

const Shell = styled.div`
  min-height: 100vh;
  color: var(--text);
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 16, 20, 0.82);
  backdrop-filter: blur(14px);
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: var(--accent);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.01em;
`;

const Menu = styled.div`
  display: flex;
  gap: 8px;
`;

const MenuItem = styled(NavLink)`
  padding: 8px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(245, 247, 251, 0.72);
  transition: background-color 140ms ease, color 140ms ease;

  &:hover {
    color: var(--text);
  }

  &.active {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
    font-weight: 700;
  }
`;

const Main = styled.main`
  width: min(1840px, calc(100vw - 64px));
  margin: 0 auto;
  padding: 34px 0 56px;

  @media (max-width: 768px) {
    width: min(100vw - 24px, 1840px);
    padding-top: 24px;
  }
`;

export function Layout() {
  return (
    <Shell>
      <Nav>
        <Logo to="/">Movy</Logo>
        <Menu>
          <MenuItem to="/movie">Movie</MenuItem>
          <MenuItem to="/search">Search</MenuItem>
          <MenuItem to="/library">Library</MenuItem>
        </Menu>
      </Nav>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
}
