import { Word, makeWord, setFirstWordPos, getWordCellsOnRow } from "./Word";
import { Xing, makeXing } from "./Xing";
import { PuzModelCell, makePuzModelCell } from "./PuzModelCell";
import randomWords from "random-words";

const initWords = (wordsQty: number): Word[] => {
  return randomWords(wordsQty).map(word => makeWord(word));
};

const initPuzModel = (
  puzHeight: number,
  puzWidth: number,
  firstWordCells: PuzModelCell[]
): PuzModelCell[][] => {
  const puzModel: PuzModelCell[][] = [];
  for (let i = 0; i < puzHeight; i++) {
    const row: PuzModelCell[] = [];
    for (let j = 0; j < puzWidth; j++) {
      row.push(makePuzModelCell(i, j, ""));
    }
    puzModel.push(row);
  }
  for (let i = 0; i < firstWordCells.length; i++)
    puzModel[0][i] = { ...firstWordCells[i] };
  return puzModel;
};

const initXings = (words: Word[]): Xing[] => {
  const xings: Xing[] = [];
  for (let h = 0; h < words.length - 1; h++) {
    for (let i = 0; i < words[h].word.length; i++) {
      for (let j = h + 1; j < words.length; j++) {
        for (let k = 0; k < words[j].word.length; k++) {
          if (words[h].word[i] === words[j].word[k]) {
            xings.push(makeXing(h, i, j, k));
            xings.push(makeXing(j, k, h, i));
          }
        }
      }
    }
  }
  return xings;
};

export interface Props {
  wordsQty: number;
  puzWidth: number;
  puzHeight: number;
  dispWordsQty: number;
  words: Word[];
  xings: Xing[];
  puzModel: PuzModelCell[][];
}

export const initProps = (
  wordsQty: number,
  puzWidth: number,
  puzHeight: number
): Props => {
  const words: Word[] = initWords(wordsQty);
  words[0] = setFirstWordPos(words[0]);
  return {
    wordsQty: wordsQty,
    puzWidth: puzWidth,
    puzHeight: puzHeight,
    dispWordsQty: 1,
    words: words,
    xings: initXings(words),
    puzModel: initPuzModel(
      puzHeight,
      puzWidth,
      getWordCellsOnRow(words[0], 0) || [makePuzModelCell(0, 0, "")]
    )
  };
};
