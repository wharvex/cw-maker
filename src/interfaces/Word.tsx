import { PuzModelCell, makePuzModelCell } from "./PuzModelCell";

export interface Word {
  word: string;
  pos: number[][] | null;
  isAcross: boolean | null;
}

export const makeWord = (word: string): Word => {
  return {
    word: word,
    pos: null,
    isAcross: null
  };
};

export const setFirstWordPos = (word: Word): Word => {
  const firstWordPos: number[][] = [];
  for (let i = 0; i < word.word.length; i++) firstWordPos.push([0, i]);
  return {
    word: word.word,
    pos: firstWordPos,
    isAcross: true
  };
};

export const updatePuzModel = (
  word: Word,
  puzModel: PuzModelCell[][]
): void | undefined => {
  if (!word.pos) return;
  let acrossWord: string = (word.isAcross && word.word) || "";
  let downWord: string = (!word.isAcross && word.word) || "";
  let cell: PuzModelCell;
  for (let i = 0; i < word.pos.length; i++) {
    cell = puzModel[word.pos[i][0]][word.pos[i][1]];
    acrossWord = cell.acrossWord || acrossWord;
    downWord = cell.downWord || downWord;
    puzModel[word.pos[i][0]][word.pos[i][1]] = makePuzModelCell(
      word.word[i],
      acrossWord,
      downWord
    );
  }
};
