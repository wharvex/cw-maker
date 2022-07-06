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
  isCandidate: null | boolean;
}

export type Xing = [XingWord, XingWord];

export const makeXingWord = (
  word: string,
  letterIdxInWord: number,
  isAcross: boolean
): XingWord => {
  return {
    word: word,
    letterIdxInWord: letterIdxInWord,
    isAcross: isAcross,
    isCandidate: null
  };
};

export const getXingWordWithUpdatedIsCandidate = (
  xingWord: XingWord
): XingWord => {
  return { ...xingWord, isCandidate: true };
};

export const doXingWordAndWordMatch = (
  xingWord: XingWord,
  word: Word
): boolean => {
  return word.word === xingWord.word && word.isAcross === xingWord.isAcross;
};

export const getXingWordMatchIdx = (
  word: Word,
  xing: Xing
): number | undefined => {
  if (doXingWordAndWordMatch(xing[0], word)) return 0;
  else if (doXingWordAndWordMatch(xing[1], word)) return 1;
  else return;
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
  const ret: XingWord | undefined = xing.find(xingWord =>
    isXingWordDisplayed(words, xingWord)
  );
  return ret && { ...ret };
};

export const getDisplayedXingWord = (words: Word[], xing: Xing): XingWord => {
  return {...(xing.find(xingWord =>
    isXingWordDisplayed(words, xingWord)
  ) as XingWord)};
};

export const getNonDisplayedXingWord = (words: Word[], xing: Xing): XingWord => {
  return {...(xing.find(xingWord =>
    !isXingWordDisplayed(words, xingWord)
  ) as XingWord)};
};

export const getNonDisplayedXingWordSafe = (
  words: Word[],
  xing: Xing
): XingWord | undefined => {
  const ret: XingWord | undefined = xing.find(
    xingWord => !isXingWordDisplayed(words, xingWord)
  );
  return ret && { ...ret };
};

export const getHalfDisplayedXings = (
  displayedWords: Word[],
  xings: Xing[]
): Xing[] => {
  const ret: Xing[] = [];
  let xingWordMatchIdx: number | undefined;
  let otherXingWordIdx: number;
  let updatedXing: Xing;
  for (let word of displayedWords) {
    for (let xing of xings) {
      xingWordMatchIdx = getXingWordMatchIdx(word, xing);
      if (xingWordMatchIdx === undefined) continue;
      otherXingWordIdx = xingWordMatchIdx ? 0 : 1;
      // Check if other xingWord is displayed as well.
      if (displayedWords.some(dw => dw.word === xing[otherXingWordIdx].word))
        continue;
      updatedXing = [...xing];
      updatedXing[xingWordMatchIdx] = getXingWordWithUpdatedIsCandidate(
        updatedXing[xingWordMatchIdx]
      );
      ret.push(updatedXing);
    }
  }
  return ret;
};
