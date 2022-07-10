import { initProps, Props } from "./interfaces/Props";
import {
  Word,
  WordCandidate,
  getDisplayedWords,
  makeWordCandsFromHalfDispXings,
  getUpdatedWord,
  getWordsWithUpdatedWord
} from "./interfaces/Word";
import { Xing, getHalfDisplayedXings } from "./interfaces/Xing";
import {
  PuzModelCell,
  anyCellTakenDiffLetter,
  getGoodSurroundWords,
  anyBadSurroundCells,
  getPuzModelWithAddedWord
} from "./interfaces/PuzModelCell";
import {
  makePassStageState,
  Passes,
  Pass,
  PassStageState,
  getLastPSS,
  getPassesWithUpdatedNewPass,
  isIncrVCIdxValid
} from "./interfaces/PassStageState";

const getVettedCandidates = (
  puzModel: PuzModelCell[][],
  xings: Xing[],
  words: Word[],
  inLookahead: boolean
): WordCandidate[] => {
  const displayedWords: Word[] = getDisplayedWords(words);
  const halfDispXings: Xing[] = getHalfDisplayedXings(displayedWords, xings);
  const wordCandidates: WordCandidate[] = makeWordCandsFromHalfDispXings(
    halfDispXings,
    words,
    puzModel
  );
  const ret: WordCandidate[] = [];
  let goodWords: string[];
  for (let cand of wordCandidates) {
    if (anyCellTakenDiffLetter(cand)) continue;
    goodWords = getGoodSurroundWords(cand);
    if (!goodWords.length) continue;
    if (anyBadSurroundCells(cand.surroundCells, goodWords)) continue;
    ret.push(cand);
  }
  return ret;
};

const getBestPuzModel = (
  vetCands: WordCandidate[],
  words: Word[],
  puzModel: PuzModelCell[][],
  xings: Xing[],
  curDispWordsQty: number,
  topDispWordsQty: number,
  bestModel: PuzModelCell[][]
): [Word[], PuzModelCell[][], PuzModelCell[][], number, number] => {
  curDispWordsQty++;
  if (curDispWordsQty > topDispWordsQty) {
    topDispWordsQty = curDispWordsQty;
    bestModel = puzModel;
  }
  let vcWord: Word;
  const puzModelTemp: PuzModelCell[][] = puzModel;
  const wordsTemp: Word[] = words;
  for (let vc of vetCands) {
    vcWord = getUpdatedWord(
      vc.xingWordCandidate.word,
      vc.xingWordCandidate.isAcross,
      vc.wordCells.map((cell: PuzModelCell) => cell.coords)
    );
    words = getWordsWithUpdatedWord(vcWord, words);
    puzModel = getPuzModelWithAddedWord(vcWord, puzModel);
    vetCands = getVettedCandidates(puzModel, xings, words, false);
    if (!vetCands.length) continue;
    return getBestPuzModel(
      vetCands,
      words,
      puzModel,
      xings,
      curDispWordsQty,
      topDispWordsQty,
      bestModel
    );
  }
  return [words, puzModel, bestModel, curDispWordsQty, topDispWordsQty];
};

export const getBestPuzModel2 = (
  props: Props,
  vcsParam: WordCandidate[]
): PuzModelCell[][] => {
  let curPassIdx: number;
  let curStageIdx: number;
  let curVCIdx: number;
  let curVCs: WordCandidate[];
  let curWords: Word[];
  let curPuzModel: PuzModelCell[][];
  let useStage: number | null = null;
  let passes: Passes = [
    [
      makePassStageState(
        0,
        0,
        0,
        [...vcsParam],
        [...props.words],
        [...props.puzModel]
      )
    ]
  ];
  let curPassStage: PassStageState;
  while (useStage === null || useStage >= 0) {
    // Move these state re-assignments to places after a new Pass or PSS is pushed.
    // Follow these post-push re-assignments with 'continue' statements so the
    // while condition catches if useStage becomes invalid.
    // This while loop should not move to a new iteration without redefinitions
    // of all the state vars first. Before these redefinitions, it is tested whether
    // a new PSS is needed on the current pass (newVCs has length), or a new pass
    // is needed with the current stageIdx (new VCs has no length and
    // curVCIdx < curVCs.length - 1) (assigned to the useStage field of the created PSS),
    // or a new pass is needed with the current stageIdx minus one (new VCs has no length
    // and curVCIdx >= curVCs.length - 1).
    curPassStage = getLastPSS(passes);
    ({
      passIdx: curPassIdx,
      stageIdx: curStageIdx,
      vcIdx: curVCIdx,
      vcs: curVCs,
      words: curWords,
      puzMod: curPuzModel,
      useStage
    } = curPassStage);
    if (useStage !== null) {
      if (isIncrVCIdxValid(passes, useStage)) {
        passes = getPassesWithUpdatedNewPass(passes);
      }
    }
  }
  return props.puzModel;
};

export const driver = (
  props: Props,
  getBest: boolean,
  step: boolean
): Props => {
  if (!step) {
    props = initProps(
      props.wordsQty,
      props.puzHeight,
      props.puzWidth,
      props.origWords
    );
  }
  let vettedCandidates: WordCandidate[] = getVettedCandidates(
    props.puzModel,
    props.xings,
    props.words,
    false
  );
  if (!vettedCandidates.length) return { ...props };
  if (getBest) {
    return { ...props };
  }
  let vetIdx = Math.floor(Math.random() * vettedCandidates.length);
  let vcWord: Word;
  while (vettedCandidates.length) {
    props.dispWordsQty++;
    vcWord = getUpdatedWord(
      vettedCandidates[vetIdx].xingWordCandidate.word,
      vettedCandidates[vetIdx].xingWordCandidate.isAcross,
      vettedCandidates[vetIdx].wordCells.map(
        (cell: PuzModelCell) => cell.coords
      )
    );
    props.words = getWordsWithUpdatedWord(vcWord, props.words);
    props.puzModel = getPuzModelWithAddedWord(vcWord, props.puzModel);
    vettedCandidates = getVettedCandidates(
      props.puzModel,
      props.xings,
      props.words,
      false
    );
    vetIdx = Math.floor(Math.random() * vettedCandidates.length);
  }
  return {
    ...props
  };
};

// let topVettedCandScore: number = -1;
// let topVettedCandIdx: number = -1;
// let newWords: Word[] = [];
// let newPuzModel: PuzModelCell[][] = [];
// let vCandWord: Word;
// let newVCands: WordCandidate[];
// let newWordsTemp: Word[];
// let newPuzModelTemp: PuzModelCell[][];
// for (let i = 0; i < vettedCandidates.length; i++) {
//   vCandWord = getUpdatedWord(
//     vettedCandidates[i].xingWordCandidate.word,
//     vettedCandidates[i].xingWordCandidate.isAcross,
//     vettedCandidates[i].wordCells.map((cell: PuzModelCell) => cell.coords)
//   );
//   newWordsTemp = getWordsWithUpdatedWord(vCandWord, props.words);
//   newPuzModelTemp = getPuzModelWithAddedWord(vCandWord, props.puzModel);
//   newVCands = getVettedCandidates(
//     newPuzModelTemp,
//     props.xings,
//     newWordsTemp,
//     true
//   );
//   if (newVCands.length > topVettedCandScore) {
//     topVettedCandScore = newVCands.length;
//     topVettedCandIdx = i;
//     newWords = newWordsTemp;
//     newPuzModel = newPuzModelTemp;
//   }
// }
// return {
//   ...props,
//   puzModel: newPuzModel.length ? newPuzModel : props.puzModel,
//   words: newWords.length ? newWords : props.words
// };
