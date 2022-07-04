import { PuzModelCell, getPuzModelCell, getUpdatedCell } from "./PuzModelCell";
import {
  getWordPos,
  Word,
  getWord,
  getWordPosFromLetterPos,
  WordCandidate,
  makeWordCandidate,
  LetterPos
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
  return getWordPos(getWord(words, xingWord.word)) !== null;
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
    .filter(xing =>
      displayedWords.some(
        word =>
          xing.some(xingWord => doXingAndWordMatch(xingWord, word)) &&
          !xing.every(xingWord => isXingWordDisplayed(displayedWords, xingWord))
      )
    )
    .slice();
};

export const getInBoundsXingsFromDisplayedXings = (
  displayedXings: Xing[],
  words: Word[]
): Xing[] => {
  const ret: Xing[] = [];
  let displayedXingWord: XingWord;
  let nonDisplayedXingWord: XingWord;
  let wordPosCandidate: LetterPos[];
  let letterPosCandidate: LetterPos;
  for (let xing of displayedXings) {
    displayedXingWord = getDisplayedXingWord(words, xing);
    nonDisplayedXingWord = getNonDisplayedXingWord(words, xing);
    letterPosCandidate = getWordPos(getWord(words, nonDisplayedXingWord.word))[
      nonDisplayedXingWord.letterIdxInWord
    ];
  }
};
