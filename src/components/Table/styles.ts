import styled from "styled-components";
import { shade } from "polished";

export const Container = styled.table`
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
  background: #232129;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  border: 0;
  padding: 32px 32px;
  color: #dbd3ed;

  font-weight: 500;
  margin-top: 16px;

  border-collapse: collapse;

  thead {
    padding: 20px;
    height: 20px;

    tr th {
      padding: 10px;
      border-bottom: solid white;
      height: 20px;
    }
  }

  tbody {
    padding: 20px;
    height: 20px;

    tr {
      height: 20px;
      &:hover {
        background-color: ${shade(0.2, "#232129")};
      }
      td {
        padding: 10px;
        border-bottom: 1px solid white;
        text-align: center;
        div {
          display: flex;
          flex-direction: row;
        }
        button {
          background-color: inherit;
          text-decoration: none;
          color: inherit;
          border: none;

          & + button {
            padding-left: 1rem;
          }
        }
      }
    }
  }
`;
