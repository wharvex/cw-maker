import {
  Coords,
  PuzModelCell,
  getPuzModelCell,
  getUpdatedCell
} from "./PuzModelCell";
import {
  getWordCoords,
  Word,
  getWord,
  getWordCoordsFromLetterCoords,
  WordCandidate,
  makeWordCandidate
} from "./Word";

export interface XingWord {
  word: string;
  letterIdxInWord: number;
  isAcross: boolean;
}

export const makeXingWord = (
  word: string,
  letterIdxInWord: number,
  isAcross: boolean
): XingWord => {
  return {
    word: word,
    letterIdxInWord: letterIdxInWord,
    isAcross: isAcross
  };
};

export type Xing = [XingWord, XingWord];

export const doXingAndWordMatch = (xing: XingWord, word: Word): boolean => {
  return word.word === xing.word && word.isAcross === xing.isAcross;
};

export const isXingWordDisplayed = (
  words: Word[],
  xingWord: XingWord
): boolean => {
  return getWordCoords(getWord(words, xingWord.word)) !== null;
};

export const getDisplayedXingWordSafe = (
  words: Word[],
  xing: Xing
): XingWord | undefined => {
  return xing.find(xingWord => isXingWordDisplayed(words, xingWord));
};

export const getDisplayedXingWord = (words: Word[], xing: Xing): XingWord => {
  return xing.find(xingWord =>
    isXingWordDisplayed(words, xingWord)
  ) as XingWord;
};

export const getNonDisplayedXingWord = (
  words: Word[],
  xing: Xing
): XingWord => {
  return xing.find(
    xingWord => !isXingWordDisplayed(words, xingWord)
  ) as XingWord;
};

export const getXingsFromDisplayedWords = (
  displayedWords: Word[],
  xings: Xing[]
): Xing[] => {
  return xings
    .slice()
    .filter(xing =>
      displayedWords.some(
        word =>
          xing.some(xingWord => doXingAndWordMatch(xingWord, word)) &&
          !xing.every(xingWord => isXingWordDisplayed(displayedWords, xingWord))
      )
    );
};
