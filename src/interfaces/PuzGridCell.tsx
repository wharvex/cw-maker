export interface PuzGridCell {
  row: number;
  col: number;
  contents: string;
}

export const makePuzGridCell = (
  row: number,
  col: number,
  contents: string
): PuzGridCell => {
  return {
    row: row,
    col: col,
    contents: contents
  };
};

export const initPuzGrid = (
  puzGridHeight: number,
  puzGridWidth: number,
  firstWord: PuzGridCell[]
): PuzGridCell[] => {
  const puzGrid: PuzGridCell[] = [];
  for (let i = 0; i < puzGridHeight; i++) {
    for (let j = 0; j < puzGridWidth; j++) {
      puzGrid.push(makePuzGridCell(i, j, ""));
    }
  }
  for (let i = 0; i < firstWord.length; i++) puzGrid[i] = firstWord[i];
  return puzGrid;
};
