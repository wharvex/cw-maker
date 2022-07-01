import React, { ReactElement } from "react";
import { Props } from "../interfaces/Props";

export const Puzzle: React.FC<Props> = (props: Props) => {
  const getCell = (
    row: number,
    col: number,
    cellProps: Props
  ): ReactElement => {
    return <td>{cellProps.puzModel[row][col].contents}</td>;
  };

  const getRows = (
    rowProps: Props
  ): ReactElement<any, string | React.JSXElementConstructor<any>>[] => {
    const rows: ReactElement<
      any,
      string | React.JSXElementConstructor<any>
    >[] = [];
    for (let i = 0; i < rowProps.puzModel.length; i++) {
      let row: ReactElement[] = [];
      for (let j = 0; j < rowProps.puzModel[i].length; j++) {
        row.push(getCell(i, j, rowProps));
      }
      rows.push(<tr>{row}</tr>);
    }
    return rows;
  };

  return <table>{getRows(props)}</table>;
};
