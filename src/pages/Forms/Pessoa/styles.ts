import styled from "styled-components";

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
  min-width: 800px;
  margin: 64px auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  h2 {
    margin-bottom: 3rem;
  }
  form {
    width: 50%;
  }
`;
