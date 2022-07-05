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
  puzHeight: number,
  puzWidth: number
): boolean => {
  return (
    coords[0] < puzHeight &&
    coords[1] < puzWidth &&
    coords.every(coord => coord > 0)
  );
};

export const getCoordsSafe = (
  coords: Coords,
  puzHeight: number,
  puzWidth: number
): Coords | undefined => {
  return areCoordsSafe(coords, puzHeight, puzWidth) ? [...coords] : undefined;
};

export const cellContainsDownWord = (cell: PuzModelCell): boolean => {
  return Boolean(cell.downWord);
};

export const cellContainsAcrossWord = (cell: PuzModelCell): boolean => {
  return Boolean(cell.acrossWord);
};

export const cellContainsTwoWords = (cell: PuzModelCell): boolean => {
  return Boolean(cell.downWord) && Boolean(cell.acrossWord);
};

export const getPuzModelCellSafe = (
  coords: Coords,
  puzModel: PuzModelCell[][]
): PuzModelCell | undefined => {
  return getCoordsSafe(coords, puzModel.length, puzModel[0].length)
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

export const areWordCoordsOnModel = (
  puzHeight: number,
  puzWidth: number,
  wordCoords: Coords[]
): boolean => {
  return wordCoords.every(letterCoords =>
    areCoordsSafe(letterCoords, puzHeight, puzWidth)
  );
};

export const areAnyTakenSpacesConflicts = (
  word: Word,
  wordCoordsCandidate: Coords[],
  puzModel: PuzModelCell[][]
): boolean => {
  return wordCoordsCandidate.some(
    (letterCoords: Coords, i: number) =>
      getPuzModelCell(letterCoords, puzModel).contents !== word.word[i] &&
      getPuzModelCell(letterCoords, puzModel).contents !== "*"
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

export const getTakenSpacesNonConflicts = (
  // Pass the result of this func to surround check as exceptions.
  // Make this func return the surruounding cells on the displayed word.
  wordCandidate: WordCandidate,
  puzModel: PuzModelCell[][]
): PuzModelCell[] => {
  const ret: PuzModelCell[] = [];
  let cell: PuzModelCell;
  const { coordsCandidate, xingWordCandidate } = wordCandidate;
  let dynamicDirection: number;
  let dynamicCoords1: Coords | undefined;
  let dynamicCoords2: Coords | undefined;
  let staticDirection: number;
  let staticCoords: Coords;
  for (let i = 0; i < coordsCandidate.length; i++) {
    cell = getPuzModelCell(coordsCandidate[i], puzModel);
    // Ensure letter matches and candidate is in opposite direction of word already at taken space.
    if (
      cell.contents === xingWordCandidate.word[i] &&
      ((cellContainsDownWord(cell) && xingWordCandidate.isAcross) ||
        (cellContainsAcrossWord(cell) && !xingWordCandidate.isAcross)) &&
      !cellContainsTwoWords(cell)
    ) {
      // If the word whose letter is in cell is across, in order to find
      // the surrounding cells, you need to change the column (index 1) &vv
      dynamicDirection = cell.acrossWord ? 1 : 0;
      staticDirection = dynamicDirection ? 0 : 1;
      dynamicCoords1 = getCoordsSafe(
        getCoordsGeneric(
          staticDirection,
          cell.coords[staticDirection],
          dynamicDirection,
          cell.coords[dynamicDirection] - 1
        ),
        puzModel.length,
        puzModel[0].length
      );
      dynamicCoords2 = getCoordsSafe(
        getCoordsGeneric(
          staticDirection,
          cell.coords[staticDirection],
          dynamicDirection,
          cell.coords[dynamicDirection] + 1
        ),
        puzModel.length,
        puzModel[0].length
      );
      [dynamicCoords1, dynamicCoords2].forEach(
        coords => coords && ret.push(getPuzModelCell(coords, puzModel))
      );
    }
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
