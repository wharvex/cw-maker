import {
  Word,
  makeWord,
  getWordWithAddedIsAcross,
  getUpdatedWord,
  getUpdatedFirstWord
} from "./Word";
import { Xing, makeXingWord } from "./Xing";
import {
  PuzModelCell,
  makePuzModelCell,
  getPuzModelWithAddedWord
} from "./PuzModelCell";
import randomWords from "random-words";

const initWords = (wordsQty: number): Word[] => {
  const wordsSet: Set<string> = new Set(randomWords(wordsQty));
  while (wordsSet.size < wordsQty)
    wordsSet.add(...(randomWords(1) as [string]));
  const wordsArr: Word[] = [];
  wordsSet.forEach(word => wordsArr.push(makeWord(word)));
  return wordsArr;
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
      row.push(makePuzModelCell([i, j], "*", "", ""));
    }
    puzModel.push(row);
  }
  return getPuzModelWithAddedWord(
    getUpdatedFirstWord(firstWord, puzHeight, puzWidth),
    puzModel
  );
};

const initXings = (words: Word[]): Xing[] => {
  const xings: Xing[] = [];
  for (let h = 0; h < words.length - 1; h++) {
    for (let i = 0; i < words[h].word.length; i++) {
      for (let j = h + 1; j < words.length; j++) {
        for (let k = 0; k < words[j].word.length; k++) {
          if (words[h].word[i] === words[j].word[k]) {
            xings.push([
              makeXingWord(words[h].word, i, true),
              makeXingWord(words[j].word, k, false)
            ]);
            xings.push([
              makeXingWord(words[h].word, i, false),
              makeXingWord(words[j].word, k, true)
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
