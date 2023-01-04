import { getWordCoords, Word, WordCandidate } from "./Word";
import { XingWord } from "./Xing";
import { Coords } from "../types"

/**
 * Models a cell on the crossword puzzle {@link Grid}.
 */
class Cell {
    coords: Coords;
    contents: string;
    acrossWord?: string;
    downWord?: string;

    /**
     * Constructor for this {@link Cell}.
     *
     * @param coords - coordinates giving the position of this {@link Cell} in its {@link Grid}.
     * @param contents - the contents of this {@link Cell} (letter or space). 
     * @param acrossWord - the {@link Word} going across, of which this {@link Cell} contains a letter.
     * @param downWord - the {@link Word} going down, of which this {@link Cell} contains a letter.
     */
    constructor(
        coords: Coords,
        contents: string,
        acrossWord?: string,
        downWord?: string) {
        this.coords = coords;
        this.contents = contents;
        this.acrossWord = acrossWord;
        this.downWord = downWord;
    }

    static copyConstructor(c: Cell) {
        return new Cell([...c.coords], c.contents, c.acrossWord, c.downWord);
    }

    /**
     * Checks if this {@link Cell} object has the position of the given {@link Coords}.
     *
     * @param coords - the given {@link Coords}
     * @return true if it has the position; false otherwise
     */
    coordsEq(coords: Coords): boolean {
        return this.coords[0] == coords[0] && this.coords[1] == coords[1];
    }

    export const getCell = (
        coords: Coords,
        puzzle: Cell[][]
    ): Cell => {
        return { ...puzzle[coords[0]][coords[1]] };
    };

    export const getPuzzleWithUpdatedCells = (
        updatedCells: Cell[],
        puzzle: Cell[][]
    ): Cell[][] => {
        const ret: Cell[][] = [];
        let cellRow: Cell[];
        let updatedCell: Cell | undefined;
        for (let row of puzzle) {
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
        oldCell: Cell,
        contents: string,
        acrossWord: string,
        downWord: string
    ): Cell => {
        const newCell: Cell = { ...oldCell };
        newCell.contents = contents;
        newCell.acrossWord = acrossWord;
        newCell.downWord = downWord;
        return newCell;
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
        xingWordCand: XingWord,
        coordsCand: Coords[],
        puzzle: Cell[][]
    ): (Cell | undefined)[] => {
        const staticDirection: number = xingWordCand.isAcross ? 0 : 1;
        const leftOrTopStatic: number = coordsCand[0][staticDirection] - 1;
        const middleStatic: number = coordsCand[0][staticDirection];
        const rightOrBottomStatic: number = coordsCand[0][staticDirection] + 1;
        const dynamicDirection: number = staticDirection ? 0 : 1;
        const beforeBeginning: Cell | undefined = getCellSafe(
            getCoordsGeneric(
                staticDirection,
                middleStatic,
                dynamicDirection,
                coordsCand[0][dynamicDirection] - 1
            ),
            puzzle
        );
        const afterEnd: Cell | undefined = getCellSafe(
            getCoordsGeneric(
                staticDirection,
                middleStatic,
                dynamicDirection,
                coordsCand[coordsCand.length - 1][dynamicDirection] + 1
            ),
            puzzle
        );
        const ret: (Cell | undefined)[] = [beforeBeginning, afterEnd];
        let leftOrTop: Cell | undefined;
        let rightOrBottom: Cell | undefined;
        for (let i = 0; i < coordsCand.length; i++) {
            leftOrTop = getCellSafe(
                getCoordsGeneric(
                    staticDirection,
                    leftOrTopStatic,
                    dynamicDirection,
                    coordsCand[i][dynamicDirection]
                ),
                puzzle
            );
            rightOrBottom = getCellSafe(
                getCoordsGeneric(
                    staticDirection,
                    rightOrBottomStatic,
                    dynamicDirection,
                    coordsCand[i][dynamicDirection]
                ),
                puzzle
            );
            ret.push(leftOrTop, rightOrBottom);
        }
        return ret;
    };

    export const anyBadSurroundCells = (
        surroundCells: (Cell | undefined)[],
        goodWords: string[]
    ): boolean => {
        for (let cell of surroundCells) {
            for (let word of goodWords) {
                if (
                    cell &&
                    ((cell.acrossWord && cell.acrossWord !== word) ||
                        (cell.downWord && cell.downWord !== word)) &&
                    cell.contents !== "*"
                )
                    return true;
            }
        }
        return false;
    };

    export const getWordCandCells = (
        coordsCand: Coords[],
        puzzle: Cell[][]
    ): Cell[] => {
        return coordsCand.map((letterCoords: Coords) =>
            getCell(letterCoords, puzzle)
        );
    };

    export const anyCellTakenDiffLetter = (wordCand: WordCandidate): boolean => {
        const { wordCells, xingWordCandidate } = wordCand;
        return wordCells.some(
            (cell: Cell, i: number) =>
                cell.contents !== xingWordCandidate.word[i] && cell.contents !== "*"
        );
    };

    export const getGoodSurroundWords = (wordCand: WordCandidate): string[] => {
        const { xingWordCandidate, wordCells, dispWord } = wordCand;
        let letterMatch: boolean;
        let oppDirection: boolean;
        const ret: string[] = [];
        const retSet: Set<string> = new Set([dispWord]);
        for (let i = 0; i < wordCells.length; i++) {
            letterMatch = wordCells[i].contents === xingWordCandidate.word[i];
            oppDirection =
                (hasAcross(wordCells[i]) && !xingWordCandidate.isAcross) ||
                (hasDown(wordCells[i]) && xingWordCandidate.isAcross);
            if (letterMatch && oppDirection && !has2Words(wordCells[i]))
                retSet.add(wordCells[i].acrossWord || wordCells[i].downWord);
        }
        retSet.forEach((word: string) => ret.push(word));
        return ret;
    };

    export const getPuzzleWithAddedWord = (
        word: Word,
        puzzle: Cell[][]
    ): Cell[][] => {
        let acrossWord: string = word.isAcross ? word.word : "";
        let downWord: string = !word.isAcross ? word.word : "";
        let oldCell: Cell;
        const updatedCells: Cell[] = [];
        for (let i = 0; i < getWordCoords(word).length; i++) {
            oldCell = getCell(getWordCoords(word)[i], puzzle);
            acrossWord = oldCell.acrossWord || acrossWord;
            downWord = oldCell.downWord || downWord;
            updatedCells.push(
                getUpdatedCell(oldCell, word.word[i], acrossWord, downWord)
            );
        }
        return getPuzzleWithUpdatedCells(updatedCells, puzzle);
    };
export { Cell };
