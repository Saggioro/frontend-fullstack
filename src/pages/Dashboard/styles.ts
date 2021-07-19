import styled from "styled-components";
import { shade } from "polished";

export const Container = styled.div``;

export const Header = styled.header`
  padding: 8px 0;
  background: #28262e;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;

  margin: 0 auto;
  display: flex;
  align-items: center;
  > img {
    height: 80px;
  }
  button {
    margin-left: auto;
    background: transparent;
    border: 0;
    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;

  .botaoCadastrar {
    width: 200px;
    height: 30px;
    border-radius: 8px;
    background-color: #4da1f9;
    border: none;
    &:hover {
      background-color: ${shade(0.2, "#4da1f9")};
    }
    a {
      text-decoration: none;

      &:visited {
        color: white;
      }
    }
  }
`;
