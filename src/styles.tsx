import { Global, css } from "@emotion/react";

const globalStyle = css`
  :root {
    --bg: #0f1014;
    --bg-soft: #171920;
    --panel: #1b1d24;
    --panel-strong: #20232c;
    --border: #2a2d36;
    --text: #f5f7fb;
    --muted: #8c93a8;
    --accent: #f2bf59;
    --accent-soft: rgba(242, 191, 89, 0.18);
    --danger: #e25d57;
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: var(--bg);
  }

  body {
    margin: 0;
    font-family: "Pretendard", "Noto Sans KR", sans-serif;
    background:
      linear-gradient(180deg, rgba(255, 196, 92, 0.06), transparent 28%),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      var(--bg);
    background-size: auto, 48px 48px, 48px 48px, auto;
    color: var(--text);
    overflow-x: hidden;
  }

  #root {
    overflow-x: hidden;
    min-height: 100vh;
  }

  a,
  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  ul {
    margin: 0;
    padding-left: 20px;
  }
`;

export function GlobalStyle() {
  return <Global styles={globalStyle} />;
}
