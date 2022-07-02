import { PuzModelCell } from "./PuzModelCell";
import { getWordPos, Word, getWord } from "./Word";

export interface Xing2 {
  word: string;
  letterIdxInWord: number;
  isAcross: boolean;
}

export interface Xing {
  acrossWordWordsIdx: number;
  acrossWordXingIdx: number;
  downWordWordsIdx: number;
  downWordXingIdx: number;
  isUsed: boolean;
}

export const makeXing2 = (
  word: string,
  letterIdxInWord: number,
  isAcross: boolean
): Xing2 => {
  return {
    word: word,
    letterIdxInWord: letterIdxInWord,
    isAcross: isAcross
  };
};

export const makeXing = (
  acrossWordWordsIdx: number,
  acrossWordXingIdx: number,
  downWordWordsIdx: number,
  downWordXingIdx: number
): Xing => {
  return {
    acrossWordWordsIdx: acrossWordWordsIdx,
    acrossWordXingIdx: acrossWordXingIdx,
    downWordWordsIdx: downWordWordsIdx,
    downWordXingIdx: downWordXingIdx,
    isUsed: false
  };
};

export const doXingAndWordMatch = (xing: Xing2, word: Word): boolean => {
  return word.word === xing.word && word.isAcross === xing.isAcross;
};

export const isXingWordDisplayed = (
  words: Word[],
  xingWord: Xing2
): boolean => {
  return getWordPos(getWord(words, xingWord.word)) !== null;
};

export const getPossibleXings = (
  displayedWords: Word[],
  xings: [Xing2, Xing2][]
): [Xing2, Xing2][] => {
  return xings.filter(xing =>
    displayedWords.some(
      word =>
        xing.some(xingWord => doXingAndWordMatch(xingWord, word)) &&
        !xing.every(xingWord => isXingWordDisplayed(displayedWords, xingWord))
    )
  );
};

const isXingAllowed = (
  crossing: Xing,
  puzModel: Array<PuzModelCell>
): boolean => {
  return crossing.isUsed;
};
