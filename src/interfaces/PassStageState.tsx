import { Word, WordCandidate } from "./Word";
import { PuzModelCell } from "./PuzModelCell";

export interface PassStageState {
  passIdx: number;
  stageIdx: number;
  vcIdx: number;
  vcs: WordCandidate[];
  words: Word[];
  puzMod: PuzModelCell[][];
  useStage: number | null;
}

export const makePassStageState = (
  passIdx: number,
  stageIdx: number,
  vcIdx: number,
  vcs: WordCandidate[],
  words: Word[],
  puzMod: PuzModelCell[][],
  useStage: number | null = null
): PassStageState => {
  return {
    passIdx: passIdx,
    stageIdx: stageIdx,
    vcIdx: vcIdx,
    vcs: vcs,
    words: words,
    puzMod: puzMod,
    useStage: useStage
  };
};

export type Passes = PassStageState[][];
export type Pass = PassStageState[];

export const getLastPSS = (passes: Passes): PassStageState => {
  return { ...passes[passes.length - 1][passes[passes.length - 1].length - 1] };
};

export const getRefPSS = (passes: Passes, stageRef: number): PassStageState => {
  return { ...passes[passes.length - 2][stageRef] };
};

export const isIncrVCIdxValid = (passes: Passes, stageRef: number): boolean => {
  const refPSS: PassStageState = getRefPSS(passes, stageRef);
  return refPSS.vcs.length > refPSS.vcIdx + 1;
}

export const getUseStage = (pss: PassStageState): number => {
  return pss.useStage as number;
}

export const getPassesWithUpdatedNewPass = (passes: Passes): Passes => {
  const ret: Passes = [...passes];
  const lastPSS = getLastPSS(passes);
  const stageRef: number = getUseStage(lastPSS);
  const refPSS: PassStageState = getRefPSS(passes, stageRef);
  const retPass: Pass = passes[passes.length - 2].slice(0, stageRef)

  return ret;
};

// pushNewStage at end of loop if there are new vcs. Gets as params the new state created in the loop.
// pushNewPass at end of loop if there are no new vcs. Gets as params the old state the loop retrieved at the beginning.
export const pushNewPass = (
  pss: PassStageState,
  passes: Passes
): Passes | undefined => {
  // If returns undefined then break the while loop.
  // Returns passes with partially updated final pass. Update completes at beginning of while loop when grabbing state from the final pass.
  let newPSS: PassStageState = { ...pss, passIdx: pss.passIdx + 1 };
  let newVCIdx: number = pss.vcIdx + 1;
  if (newVCIdx >= pss.vcs.length)
    if (pss.stageIdx > 0) newPSS.stageIdx--;
    else newPSS.vcIdx++;

  // construct state from last stage of last pass passIdxPointer and stageIdx.
  // isPassesPointerValid at beginning of loop.
  // while (passes[passes.length - 1][passes[passes.length - 1].length - 1].passIdxPointer >= 0)
  // let prevPointerLastStageIdx: number;
  // if (newPSS.vcIdx < pss.vcs.length)
  //   if (pss.stageIdx > 0) {
  //     newPSS = {
  //       ...passes[pss.passIdxPointer][pss.stageIdx - 1],
  //       vcIdx: passes[pss.passIdxPointer][pss.stageIdx - 1].vcIdx + 1
  //     };
  //   } else if (pss.passIdxPointer > 0) {
  //   prevPointerLastStageIdx = passes[pss.passIdxPointer - 1].length - 1;

  //     newPSS = {
  //       ...passes[pss.passIdxPointer - 1][prevPointerLastStageIdx],

  //     };
  //   }
  return;
};
