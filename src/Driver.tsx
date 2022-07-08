import { Props } from "./interfaces/Props";
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
  getWordsOfCellsTakenSameLetter,
  anyBadSurroundCells,
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
  const wordCandidates: WordCandidate[] = makeWordCandsFromHalfDispXings(
    halfDispXings,
    words,
    puzModel
  );
  const ret: WordCandidate[] = [];
  let goodWords: string[];
  for (let cand of wordCandidates) {
    if (anyCellTakenDiffLetter(cand)) continue;
    goodWords = getWordsOfCellsTakenSameLetter(cand);
    if (!goodWords.length) continue;
    if (anyBadSurroundCells(cand.surroundCells, goodWords)) continue;
    ret.push(cand);
  }
  return ret;
};

export const driver = (props: Props): Props => {
  const vettedCandidates: WordCandidate[] = getVettedCandidates(
    props.puzModel,
    props.xings,
    props.words,
    false
  );
  if (!vettedCandidates.length) return { ...props };
  const vetIdx = Math.floor(Math.random() * vettedCandidates.length);
  const vcWord: Word = getUpdatedWord(
    vettedCandidates[vetIdx].xingWordCandidate.word,
    vettedCandidates[vetIdx].xingWordCandidate.isAcross,
    vettedCandidates[vetIdx].wordCells.map((cell: PuzModelCell) => cell.coords)
  );
  const vcWords = getWordsWithUpdatedWord(vcWord, props.words);
  const vcPuzModel = getPuzModelWithAddedWord(vcWord, props.puzModel);
  console.log(
    "vcand:",
    vettedCandidates[vetIdx],
    "goodWords:",
    getWordsOfCellsTakenSameLetter(vettedCandidates[vetIdx])
  );
  props.dispWordsQty++;
  return {
    ...props,
    puzModel: vcPuzModel.length ? vcPuzModel : props.puzModel,
    words: vcWords.length ? vcWords : props.words
  };
  let topVettedCandScore: number = -1;
  let topVettedCandIdx: number = -1;
  let newWords: Word[] = [];
  let newPuzModel: PuzModelCell[][] = [];
  let vCandWord: Word;
  let newVCands: WordCandidate[];
  let newWordsTemp: Word[];
  let newPuzModelTemp: PuzModelCell[][];
  for (let i = 0; i < vettedCandidates.length; i++) {
    vCandWord = getUpdatedWord(
      vettedCandidates[i].xingWordCandidate.word,
      vettedCandidates[i].xingWordCandidate.isAcross,
      vettedCandidates[i].wordCells.map((cell: PuzModelCell) => cell.coords)
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
