import {
  PuzModelCell,
  getPuzModelCell,
  setPuzModelCell,
  getUpdatedCell
} from "./PuzModelCell";

export interface Word {
  word: string;
  pos: [number, number][] | null;
  isAcross: boolean | null;
}

export const makeWord = (word: string): Word => {
  return {
    word: word,
    pos: null,
    isAcross: null
  };
};

const getLetterPosAdd = (
  staticIdx: number,
  staticVal: number,
  dynamicIdx: number,
  dynamicVal: number
): [number, number] => {
  const ret: [number, number] = [-1, -1];
  ret[staticIdx] = staticVal;
  ret[dynamicIdx] = dynamicVal;
  return ret;
};

export const getWordWithAddedPos = (
  givenWord: Word,
  letterIdxInWord: number,
  givenLetterPos: [number, number]
): Word => {
  const retWord: Word = { ...givenWord };
  const pos: [number, number][] = [];
  const dynamicDirection: number = (retWord.isAcross && 1) || 0;
  const staticDirection: number = (!retWord.isAcross && 1) || 0;
  const staticPos: number = givenLetterPos[staticDirection];
  const offset: number = givenLetterPos[dynamicDirection];
  if (letterIdxInWord > 0)
    for (let i = letterIdxInWord - 1; i >= 0; i--)
      pos.splice(
        0,
        0,
        getLetterPosAdd(
          dynamicDirection,
          i + offset,
          staticDirection,
          staticPos
        )
      );
  pos.push(givenLetterPos);
  if (letterIdxInWord < retWord.word.length - 1)
    for (let i = letterIdxInWord + 1; i < retWord.word.length; i++)
      pos.push(
        getLetterPosAdd(
          dynamicDirection,
          i + offset,
          staticDirection,
          staticPos
        )
      );
  retWord.pos = pos;
  return retWord;
};

export const getFirstWordWithAddedPos = (
  givenWord: Word,
  puzHeight: number,
  puzWidth: number
): Word => {
  return getWordWithAddedPos(givenWord, Math.floor(givenWord.word.length / 2), [
    Math.floor(puzHeight / 2),
    Math.floor(puzWidth / 2)
  ]);
};

export const getWordPos = (word: Word): [number, number][] => {
  return word.pos as [number, number][];
};

export const getWordPosSafe = (word: Word): [number, number][] | null => {
  return word.pos;
};

export const getPuzModelWithAddedWord = (
  word: Word,
  puzModel: PuzModelCell[][]
): PuzModelCell[][] => {
  const newPuzModel: PuzModelCell[][] = puzModel.slice();
  let acrossWord: string = (word.isAcross && word.word) || "";
  let downWord: string = (!word.isAcross && word.word) || "";
  let oldCell: PuzModelCell;
  for (let i = 0; i < getWordPos(word).length; i++) {
    oldCell = getPuzModelCell(...getWordPos(word)[i], newPuzModel);
    acrossWord = oldCell.acrossWord || acrossWord;
    downWord = oldCell.downWord || downWord;
    setPuzModelCell(
      newPuzModel,
      getUpdatedCell(oldCell, word.word[i], acrossWord, downWord)
    );
  }
  return newPuzModel;
};
