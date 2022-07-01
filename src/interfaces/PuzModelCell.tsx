import { Word } from "./Word";

export interface PuzModelCell {
  row: number;
  col: number;
  contents: string;
  acrossWord: string;
  downWord: string;
}

export const makePuzModelCell = (
  row: number,
  col: number,
  contents: string,
  acrossWord: string,
  downWord: string
): PuzModelCell => {
  return {
    row: row,
    col: col,
    contents: contents,
    acrossWord: acrossWord,
    downWord: downWord
  };
};

export const getPuzModelCellSafe = (
  row: number,
  col: number,
  puzModel: PuzModelCell[][]
): PuzModelCell | undefined => {
  if (!(row < puzModel.length && col < puzModel[0].length)) return;
  return { ...puzModel[row][col] };
};

export const getPuzModelCell = (
  row: number,
  col: number,
  puzModel: PuzModelCell[][]
): PuzModelCell => {
  return { ...puzModel[row][col] };
};

export const getPuzModelCellGeneric = (
  row: number,
  col: number,
  genArr: PuzModelCell[]
): PuzModelCell | undefined => {
  const found: PuzModelCell | undefined = genArr.find(
    cell => cell.row === row && cell.col === col
  );
  return found && { ...found };
};

export const setPuzModelCell = (
  puzModel: PuzModelCell[][],
  cell: PuzModelCell
): void => {
  puzModel[cell.row][cell.col] = { ...cell };
};

export const getUpdatedCell = (
  oldCell: PuzModelCell,
  contents: string,
  acrossWord: string,
  downWord: string
): PuzModelCell => {
  const newCell: PuzModelCell = { ...oldCell };
  newCell.contents = contents;
  newCell.acrossWord = acrossWord;
  newCell.downWord = downWord;
  return newCell;
};
