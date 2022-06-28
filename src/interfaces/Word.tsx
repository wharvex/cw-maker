import { PuzGridCell, makePuzGridCell } from "./PuzGridCell";

export interface Word {
  word: string;
  puzGridPos: number[][] | null;
  isAcross: boolean | null;
}

export const makeWord = (word: string): Word => {
  return {
    word: word,
    puzGridPos: null,
    isAcross: null
  };
};

export const setFirstWordPos = (word: Word): Word => {
  const firstWordPos: number[][] = [];
  for (let i = 0; i < word.word.length; i++) firstWordPos.push([0, i]);
  return {
    word: word.word,
    puzGridPos: firstWordPos,
    isAcross: true
  };
};

export const getWordCells = (
  word: Word,
  row: number
): PuzGridCell[] => {
  if (!word.puzGridPos) return [makePuzGridCell(row, 0, "")];
  if (word.isAcross)
    return word.puzGridPos.map(letterPos =>
      makePuzGridCell(row, letterPos[1], word.word[letterPos[1]])
    );
  else return [makePuzGridCell(row, word.puzGridPos[0][1], word.word[row])];
};
