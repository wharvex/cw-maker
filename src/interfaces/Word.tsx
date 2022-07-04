import {
  Xing,
  XingWord,
  getDisplayedXingWord,
  getNonDisplayedXingWord
} from "./Xing";

export type LetterPos = [number, number];

export interface Word {
  word: string;
  pos: LetterPos[] | null;
  isAcross: boolean | null;
}

export interface WordCandidate {
  xingWordCandidate: XingWord;
  posCandidate: LetterPos[];
  displayedXingWord: XingWord;
}

export const makeWordCandidate = (
  xingWordCandidate: XingWord,
  posCandidate: LetterPos[],
  displayedXingWord: XingWord
) => {
  return {
    xingWordCandidate: xingWordCandidate,
    posCandidate: posCandidate,
    displayedXingWord: displayedXingWord
  };
};

export const makeWordCandidatesFromXings = (
  xings: Xing[],
  words: Word[]
): WordCandidate[] => {
  const ret: WordCandidate[] = [];
  let nonDisplayedXingWord: XingWord;
  let displayedXingWord: XingWord;
  let letterPosCandidate: LetterPos;
  let getWordPosArgs: [string, number, boolean];
  for (let xing of xings) {
    nonDisplayedXingWord = getNonDisplayedXingWord(words, xing);
    getWordPosArgs = Object.values(nonDisplayedXingWord) as [
      string,
      number,
      boolean
    ];
    displayedXingWord = getDisplayedXingWord(words, xing);
    letterPosCandidate = getWordPos(getWord(words, nonDisplayedXingWord.word))[
      nonDisplayedXingWord.letterIdxInWord
    ];
    ret.push(
      makeWordCandidate(
        nonDisplayedXingWord,
        getWordPosFromLetterPos(...getWordPosArgs, letterPosCandidate),
        displayedXingWord
      )
    );
  }
  return ret;
};

export const getWord = (words: Word[], wordStr: string): Word => {
  return words.find(word => word.word === wordStr) as Word;
};

export const makeWord = (word: string): Word => {
  return {
    word: word,
    pos: null,
    isAcross: null
  };
};

export const getWordWithAddedIsAcross = (
  word: Word,
  isAcross: boolean
): Word => {
  return { ...word, isAcross: isAcross };
};

export const getWordWithAddedPos = (word: Word, pos: LetterPos[]): Word => {
  return { ...word, pos: pos };
};

const getLetterPosGeneric = (
  staticIdx: number,
  staticVal: number,
  dynamicIdx: number,
  dynamicVal: number
): LetterPos => {
  const ret: LetterPos = [-1, -1];
  ret[staticIdx] = staticVal;
  ret[dynamicIdx] = dynamicVal;
  return ret;
};

export const getWordPosFromLetterPos = (
  givenWordStr: string,
  letterIdxInWord: number,
  givenWordIsAcross: boolean,
  givenLetterPos: LetterPos
): LetterPos[] => {
  const pos: LetterPos[] = [];
  const dynamicDirection: number = (givenWordIsAcross && 1) || 0;
  const staticDirection: number = (!givenWordIsAcross && 1) || 0;
  const staticPos: number = givenLetterPos[staticDirection];
  const offset: number = givenLetterPos[dynamicDirection] - letterIdxInWord;
  pos.push(givenLetterPos);
  for (let i = letterIdxInWord - 1; i >= 0; i--)
    pos.splice(
      0,
      0,
      getLetterPosGeneric(
        staticDirection,
        staticPos,
        dynamicDirection,
        i + offset
      )
    );
  for (let i = letterIdxInWord + 1; i < givenWordStr.length; i++)
    pos.push(
      getLetterPosGeneric(
        staticDirection,
        staticPos,
        dynamicDirection,
        i + offset
      )
    );
  return pos;
};

export const getFirstWordWithAddedPos = (
  givenWord: Word,
  puzHeight: number,
  puzWidth: number
): Word => {
  return getWordWithAddedPos(
    givenWord,
    getWordPosFromLetterPos(
      givenWord.word,
      Math.floor(givenWord.word.length / 2),
      true,
      [Math.floor(puzHeight / 2), Math.floor(puzWidth / 2)]
    )
  );
};

export const getWordPos = (word: Word): LetterPos[] => {
  return word.pos as LetterPos[];
};

export const getWordPosSafe = (word: Word): LetterPos[] | null => {
  return word.pos;
};

export const getDisplayedWords = (words: Word[]) => {
  return words.filter(word => getWordPosSafe(word) !== null);
};
