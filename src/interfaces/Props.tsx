import {
  Word,
  makeWord,
  getPuzModelWithAddedWord,
  getFirstWordWithAddedPos
} from "./Word";
import { Xing, makeXing, Xing2, makeXing2 } from "./Xing";
import { PuzModelCell, makePuzModelCell } from "./PuzModelCell";
import randomWords from "random-words";

const initWords = (wordsQty: number): Word[] => {
  return randomWords(wordsQty).map(word => makeWord(word));
};

const initPuzModel = (
  puzHeight: number,
  puzWidth: number,
  firstWord: Word
): PuzModelCell[][] => {
  const puzModel: PuzModelCell[][] = [];
  for (let i = 0; i < puzHeight; i++) {
    const row: PuzModelCell[] = [];
    for (let j = 0; j < puzWidth; j++) {
      row.push(makePuzModelCell(i, j, "*", "", ""));
    }
    puzModel.push(row);
  }
  firstWord.isAcross = true;
  return getPuzModelWithAddedWord(
    getFirstWordWithAddedPos(firstWord, puzHeight, puzWidth),
    puzModel
  );
};

const initXings = (words: Word[]): [Xing2, Xing2][] => {
  const xings: [Xing2, Xing2][] = [];
  for (let h = 0; h < words.length - 1; h++) {
    for (let i = 0; i < words[h].word.length; i++) {
      for (let j = h + 1; j < words.length; j++) {
        for (let k = 0; k < words[j].word.length; k++) {
          if (words[h].word[i] === words[j].word[k]) {
            xings.push([
              makeXing2(words[h].word, i, true, false),
              makeXing2(words[j].word, k, false, false)
            ]);
            xings.push([
              makeXing2(words[h].word, i, false, false),
              makeXing2(words[j].word, k, true, false)
            ]);
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
  puzHeight: number,
  puzWidth: number
): Props => {
  const words: Word[] = initWords(wordsQty);
  return {
    wordsQty: wordsQty,
    puzWidth: puzWidth,
    puzHeight: puzHeight,
    dispWordsQty: 1,
    words: words,
    xings: initXings(words),
    puzModel: initPuzModel(puzHeight, puzWidth, words[0])
  };
};
