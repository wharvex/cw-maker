import { PuzModelCell } from "./PuzModelCell";

export interface Xing {
  acrossWordWordsIdx: number;
  acrossWordXingIdx: number;
  downWordWordsIdx: number;
  downWordXingIdx: number;
  isUsed: boolean;
}

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

const isXingAllowed = (
  crossing: Xing,
  puzModel: Array<PuzModelCell>
): boolean => {
  return crossing.isUsed;
};
