import { Cell } from "./Cell"
import { Coords } from "../types"

class Grid {
    height: number;
    width: number;
    grid: Cell[][] = [];

    constructor(
        h: number,
        w: number
    ) {
        this.height = h;
        this.width = w;
        for (let i = 0; i < h; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < w; j++) {
                row.push(new Cell([i, j], "*", "", ""));
            }
            this.grid.push(row);
        }
    }

    /**
     * Checks if the given {@link Coords} are nonnegative and within the bounds of this {@link Grid}.
     *
     * @param coords - the given {@link Coords} coordinates
     * @return true if coords are within the bounds and nonnegative; false otherwise
     */
    hasCoords(
        coords: Coords,
    ): boolean {
        return (
            coords[0] < this.grid.length &&
            coords[1] < this.grid[0].length &&
            coords.every(c => c >= 0)
        );
    }

    getCellSafe(coords: Coords): Cell | undefined {
        return this.hasCoords(coords) ? Cell.copyConstructor(this.grid[coords[0]][coords[1]]) : undefined;
    }
}
