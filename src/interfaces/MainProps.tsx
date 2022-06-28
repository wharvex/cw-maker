import {Word} from "./Word"
import {Crossing} from "./Crossing"
import {PuzGridCell} from "./PuzGridCell"

export interface MainProps {
  wordBankSize: number;
  wordBank: Array<Word>;
  crossings: Array<Crossing>;
  puzGrid: Array<PuzGridCell>;
}

