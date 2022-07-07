import { Props } from "./interfaces/Props";
import {
  Word,
  WordCandidate,
  getDisplayedWords,
  makeWordCandidatesFromHalfDispXings,
  getUpdatedWord,
  getWordsWithUpdatedWord
} from "./interfaces/Word";
import { Xing, makeXingWord, getHalfDisplayedXings } from "./interfaces/Xing";
import {
  PuzModelCell,
  anyTakenOnWordCellsBad,
  getTakenSurroundCellsGood,
  anyTakenSurroundCellsBad,
  getPuzModelWithAddedWord
} from "./interfaces/PuzModelCell";

const getVettedCandidates = (
  puzModel: PuzModelCell[][],
  xings: Xing[],
  words: Word[],
  inLookahead: boolean
): WordCandidate[] => {
  const displayedWords: Word[] = getDisplayedWords(words);
  const halfDispXings: Xing[] = getHalfDisplayedXings(displayedWords, xings);
  const wordCandidates: WordCandidate[] = makeWordCandidatesFromHalfDispXings(
    halfDispXings,
    words,
    puzModel.length,
    puzModel[0].length
  );
  const ret: WordCandidate[] = [];
  let exceptions: PuzModelCell[];
  for (let cand of wordCandidates) {
    if (anyTakenOnWordCellsBad(cand, puzModel)) continue;
    exceptions = getTakenSurroundCellsGood(cand, puzModel);
    if (anyTakenSurroundCellsBad(exceptions, puzModel, cand, inLookahead)) continue;
    ret.push(cand);
  }
  return ret;
};

export const driver = (props: Props) => {
  if (!props.words || !props.xings) return;
  let topVettedCandScore: number = -1;
  let topVettedCandIdx: number = -1;
  let newWords: Word[] = [];
  let newPuzModel: PuzModelCell[][] = [];
  const vettedCandidates: WordCandidate[] = getVettedCandidates(
    props.puzModel,
    props.xings,
    props.words,
    false
  );
  let vCandWord: Word;
  let newVCands: WordCandidate[];
  if (!vettedCandidates.length) return { ...props };
  props.dispWordsQty++;
  let newWordsTemp: Word[];
  let newPuzModelTemp: PuzModelCell[][];
  console.log(vettedCandidates);
  for (let i = 0; i < vettedCandidates.length; i++) {
    vCandWord = getUpdatedWord(
      vettedCandidates[i].xingWordCandidate.word,
      vettedCandidates[i].xingWordCandidate.isAcross,
      vettedCandidates[i].coordsCandidate
    );
    newWordsTemp = getWordsWithUpdatedWord(vCandWord, props.words);
    newPuzModelTemp = getPuzModelWithAddedWord(vCandWord, props.puzModel);
    newVCands = getVettedCandidates(
      newPuzModelTemp,
      props.xings,
      newWordsTemp,
      true
    );
    if (newVCands.length > topVettedCandScore) {
      topVettedCandScore = newVCands.length;
      topVettedCandIdx = i;
      newWords = newWordsTemp;
      newPuzModel = newPuzModelTemp;
    }
  }
  return {
    ...props,
    puzModel: newPuzModel.length ? newPuzModel : props.puzModel,
    words: newWords.length ? newWords : props.words
  };
};
