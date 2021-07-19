import React from "react";
import { Container } from "./styles";
export interface IColumn {
  name: string;
  value: any;
  render?: Function;
}

interface ITable {
  columns: IColumn[];
  rows: any[];
}

const Table: React.FC<ITable> = ({ rows, columns }) => {
  return (
    <Container>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.value}>{column.value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.name}>
                {column.render
                  ? column.render(row[column.name], row)
                  : row[column.name]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Container>
  );
};

export default Table;
