import { Word } from "./Word";
import { PuzGridCell } from "./PuzGridCell";

interface Crossing {
  word1Idx: number;
  word1CrossingIdx: number;
  word2Idx: number;
  word2CrossingIdx: number;
  isUsed: boolean;
}

const makeCrossing = (
  w1Idx: number,
  w1XIdx: number,
  w2Idx: number,
  w2XIdx: number
): Crossing => {
  return {
    word1Idx: w1Idx,
    word1CrossingIdx: w1XIdx,
    word2Idx: w2Idx,
    word2CrossingIdx: w2XIdx,
    isUsed: false
  };
};

const isCrossingAllowed = (
  crossing: Crossing,
  puzGrid: Array<PuzGridCell>
): boolean => {
  return crossing.isUsed;
};
export type {Crossing};
