import { getWordPos, Word, LetterPos } from "./Word";

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
  if (row >= puzModel.length || row < 0 || col >= puzModel[0].length || col < 0)
    return;
  return { ...puzModel[row][col] };
};

export const getPuzModelCell = (
  row: number,
  col: number,
  puzModel: PuzModelCell[][]
): PuzModelCell => {
  return { ...puzModel[row][col] };
};

export const getPuzModelCellFromArbitrary = (
  row: number,
  col: number,
  genArr: PuzModelCell[]
): PuzModelCell | undefined => {
  const found: PuzModelCell | undefined = genArr.find(
    cell => cell.row === row && cell.col === col
  );
  return found && { ...found };
};

export const getPuzModelWithUpdatedCells = (
  updatedCells: PuzModelCell[],
  puzModel: PuzModelCell[][]
): PuzModelCell[][] => {
  const ret: PuzModelCell[][] = [];
  let cellRow: PuzModelCell[];
  let updatedCell: PuzModelCell | undefined;
  for (let row of puzModel) {
    cellRow = [];
    for (let cell of row) {
      updatedCell = updatedCells.find(
        uCell => uCell.row === cell.row && uCell.col === cell.col
      );
      cellRow.push(updatedCell ? updatedCell : cell);
    }
    ret.push(cellRow);
  }
  return ret;
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

export const isPosOnModel = (
  puzHeight: number,
  puzWidth: number,
  pos: [number, number][]
): boolean => {
  return pos.every(
    letter =>
      letter[0] < puzHeight &&
      letter[0] >= 0 &&
      letter[1] < puzWidth &&
      letter[1] >= 0
  );
};

export const areAnyTakenSpacesConflicts = (
  word: Word,
  wordPosCandidate: [number, number][],
  puzModel: PuzModelCell[][]
): boolean => {
  return wordPosCandidate.some(
    (letterPos: [number, number], i: number) =>
      getPuzModelCell(...letterPos, puzModel).contents !== word.word[i] &&
      getPuzModelCell(...letterPos, puzModel).contents !== "*"
  );
};

export const getTakenSpacesNonConflicts = (
  wordStr: string,
  isAcrossCandidate: boolean,
  wordPosCandidate: [number, number][],
  puzModel: PuzModelCell[][]
): PuzModelCell[] => {
  const ret: PuzModelCell[] = [];
  let cell: PuzModelCell;
  for (let i = 0; i < wordPosCandidate.length; i++) {
    cell = getPuzModelCell(...wordPosCandidate[i], puzModel);
    // Ensure letter matches and candidate is in opposite direction of word already at taken space.
    if (
      cell.contents === wordStr[i] &&
      ((cell.downWord === "" && !isAcrossCandidate) ||
        (cell.acrossWord === "" && isAcrossCandidate))
    )
      ret.push(cell);
  }
  return ret;
};

export const getPuzModelWithAddedWord = (
  word: Word,
  puzModel: PuzModelCell[][]
): PuzModelCell[][] => {
  let acrossWord: string = word.isAcross ? word.word : "";
  let downWord: string = !word.isAcross ? word.word : "";
  let oldCell: PuzModelCell;
  const updatedCells: PuzModelCell[] = [];
  for (let i = 0; i < getWordPos(word).length; i++) {
    oldCell = getPuzModelCell(...getWordPos(word)[i], puzModel);
    acrossWord = oldCell.acrossWord || acrossWord;
    downWord = oldCell.downWord || downWord;
    updatedCells.push(
      getUpdatedCell(oldCell, word.word[i], acrossWord, downWord)
    );
  }
  return getPuzModelWithUpdatedCells(updatedCells, puzModel);
};
