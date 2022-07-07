import { getWordCoords, Word, WordCandidate } from "./Word";

export type Coords = [number, number];

export interface PuzModelCell {
  coords: Coords;
  contents: string;
  acrossWord: string;
  downWord: string;
}

export const makePuzModelCell = (
  coords: Coords,
  contents: string,
  acrossWord: string,
  downWord: string
): PuzModelCell => {
  return {
    coords: coords,
    contents: contents,
    acrossWord: acrossWord,
    downWord: downWord
  };
};

export const doCoordsMatch = (coords1: Coords, coords2: Coords): boolean => {
  return coords1.every((coord: number, i: number) => coord === coords2[i]);
};

export const areCoordsSafe = (
  coords: Coords,
  puzModel: PuzModelCell[][]
): boolean => {
  return (
    coords[0] < puzModel.length &&
    coords[1] < puzModel[0].length &&
    coords.every(coord => coord >= 0)
  );
};

export const hasDown = (cell: PuzModelCell): boolean => {
  return Boolean(cell.downWord);
};

export const hasAcross = (cell: PuzModelCell): boolean => {
  return Boolean(cell.acrossWord);
};

export const has2Words = (cell: PuzModelCell): boolean => {
  return Boolean(cell.downWord) && Boolean(cell.acrossWord);
};

export const getPuzModelCellSafe = (
  coords: Coords,
  puzModel: PuzModelCell[][]
): PuzModelCell | undefined => {
  return areCoordsSafe(coords, puzModel)
    ? { ...puzModel[coords[0]][coords[1]] }
    : undefined;
};

export const getPuzModelCell = (
  coords: Coords,
  puzModel: PuzModelCell[][]
): PuzModelCell => {
  return { ...puzModel[coords[0]][coords[1]] };
};

export const getPuzModelCellFromArbitrary = (
  coords: Coords,
  arbCellArr: PuzModelCell[]
): PuzModelCell | undefined => {
  const found: PuzModelCell | undefined = arbCellArr.find(cell =>
    doCoordsMatch(cell.coords, coords)
  );
  return found && { ...found };
};

export const getPuzModelWithUpdatedCells = (
  updatedCells: PuzModelCell[],
  puzModel: PuzModelCell[][]
): PuzModelCell[][] => {
  const ret: PuzModelCell[][] = [];
  let cellRow: PuzModelCell[];
  let updatedCell: PuzModelCell | undefined;
  for (let row of puzModel) {
    cellRow = [];
    for (let cell of row) {
      updatedCell = updatedCells.find(uCell =>
        doCoordsMatch(uCell.coords, cell.coords)
      );
      cellRow.push(updatedCell ? updatedCell : cell);
    }
    ret.push(cellRow);
  }
  return ret;
};

export const getUpdatedCell = (
  oldCell: PuzModelCell,
  contents: string,
  acrossWord: string,
  downWord: string
): PuzModelCell => {
  const newCell: PuzModelCell = { ...oldCell };
  newCell.contents = contents;
  newCell.acrossWord = acrossWord;
  newCell.downWord = downWord;
  return newCell;
};

export const anyTakenOnWordCellsBad = (
  wordCandidate: WordCandidate,
  puzModel: PuzModelCell[][]
): boolean => {
  // Are any taken "OnWord" cells bad (conflicts)?
  // These are already taken cells that would be ON the candidate.
  // "OnWord" cells (as opposed to surround cells) means ON the word.
  return wordCandidate.coordsCandidate.some((letterCoords: Coords, i: number) =>
    [wordCandidate.xingWordCandidate.word[i], "*"].every(
      (goodContents: string) =>
        getPuzModelCell(letterCoords, puzModel).contents !== goodContents
    )
  );
};

export const getCoordsGeneric = (
  staticIdx: number,
  staticVal: number,
  dynamicIdx: number,
  dynamicVal: number
): Coords => {
  const ret: Coords = [-1, -1];
  ret[staticIdx] = staticVal;
  ret[dynamicIdx] = dynamicVal;
  return ret;
};

export const getSurroundCells = (
  wordCandidate: WordCandidate,
  puzModel: PuzModelCell[][]
): Array<PuzModelCell | undefined> => {
  const { xingWordCandidate, coordsCandidate } = wordCandidate;
  const staticDirection: number = xingWordCandidate.isAcross ? 0 : 1;
  const leftOrTopStatic: number = coordsCandidate[0][staticDirection] - 1;
  const middleStatic: number = coordsCandidate[0][staticDirection];
  const rightOrBottomStatic: number = coordsCandidate[0][staticDirection] + 1;
  const dynamicDirection: number = staticDirection ? 0 : 1;
  const beforeBeginning: PuzModelCell | undefined = getPuzModelCellSafe(
    getCoordsGeneric(
      staticDirection,
      middleStatic,
      dynamicDirection,
      coordsCandidate[0][dynamicDirection] - 1
    ),
    puzModel
  );
  const afterEnd: PuzModelCell | undefined = getPuzModelCellSafe(
    getCoordsGeneric(
      staticDirection,
      middleStatic,
      dynamicDirection,
      coordsCandidate[coordsCandidate.length - 1][dynamicDirection] + 1
    ),
    puzModel
  );
  const ret: Array<PuzModelCell | undefined> = [beforeBeginning, afterEnd];
  let leftOrTop: PuzModelCell | undefined;
  let rightOrBottom: PuzModelCell | undefined;
  for (let i = 0; i < coordsCandidate.length; i++) {
    if (i === xingWordCandidate.letterIdxInNonCand) continue;
    leftOrTop = getPuzModelCellSafe(
      getCoordsGeneric(
        staticDirection,
        leftOrTopStatic,
        dynamicDirection,
        coordsCandidate[i][dynamicDirection] - 1
      ),
      puzModel
    );
    rightOrBottom = getPuzModelCellSafe(
      getCoordsGeneric(
        staticDirection,
        rightOrBottomStatic,
        dynamicDirection,
        coordsCandidate[i][dynamicDirection] + 1
      ),
      puzModel
    );
    ret.push(leftOrTop, rightOrBottom);
  }
  return ret;
};

export const getWordCandCells = (
  wordCand: WordCandidate,
  puzModel: PuzModelCell[][]
): PuzModelCell[] => {
  return wordCand.coordsCandidate.map((letterCoords: Coords) =>
    getPuzModelCell(letterCoords, puzModel)
  );
};

export const anyCellTakenDiffLetter = (
  wordCandCells: PuzModelCell[],
  wordCand: WordCandidate
): boolean => {
  return wordCandCells.some(
    (cell: PuzModelCell, i: number) =>
      cell.contents !== wordCand.xingWordCandidate.word[i] &&
      cell.contents !== "*"
  );
};

export const getWordsOfCellsTakenSameLetter = (
  wordCandCells: PuzModelCell[],
  wordCand: WordCandidate
): string[] => {
  let letterMatch: boolean;
  let oppDirection: boolean;
  const ret: string[] = [];
  const { xingWordCandidate } = wordCand;
  for (let i = 0; i < wordCandCells.length; i++) {
    letterMatch = wordCandCells[i].contents === xingWordCandidate.word[i];
    oppDirection =
      (hasAcross(wordCandCells[i]) && !xingWordCandidate.isAcross) ||
      (hasDown(wordCandCells[i]) && xingWordCandidate.isAcross);
    if (letterMatch && oppDirection && !has2Words(wordCandCells[i]))
      ret.push(wordCandCells[i].acrossWord || wordCandCells[i].downWord);
  }
  return ret;
};

export const getPuzModelWithAddedWord = (
  word: Word,
  puzModel: PuzModelCell[][]
): PuzModelCell[][] => {
  let acrossWord: string = word.isAcross ? word.word : "";
  let downWord: string = !word.isAcross ? word.word : "";
  let oldCell: PuzModelCell;
  const updatedCells: PuzModelCell[] = [];
  for (let i = 0; i < getWordCoords(word).length; i++) {
    oldCell = getPuzModelCell(getWordCoords(word)[i], puzModel);
    acrossWord = oldCell.acrossWord || acrossWord;
    downWord = oldCell.downWord || downWord;
    updatedCells.push(
      getUpdatedCell(oldCell, word.word[i], acrossWord, downWord)
    );
  }
  return getPuzModelWithUpdatedCells(updatedCells, puzModel);
};
