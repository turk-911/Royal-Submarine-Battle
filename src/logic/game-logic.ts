import { BoardCell, Submarine } from "../utils/types";
export function initialiseBoard(size: number): BoardCell[][] {
  return Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => ({
          isHit: false,
          isAttacked: false,
          submarine: null,
        }))
    );
}
export function placeSubmarine(
    board: BoardCell[][],
    submarine: Submarine,
    row: number,
    col: number,
    orientation: 'horizontal' | 'vertical'
): {
    updatedBoard: BoardCell[][]; 
    placedSubmarine: Submarine | null;
} {
    const updatedBoard = [...board.map((row) => [...row])];
    const { length } = submarine;
    if(orientation === 'horizontal') {
        if(col + length <= board[0].length) {
            for(let i = 0; i < length; i++) {
                if(updatedBoard[row][col + i].submarine) return { updatedBoard, placedSubmarine: null };
            }
            for(let i = 0; i < length; i++) updatedBoard[row][col + i].submarine = submarine;
            return { updatedBoard, placedSubmarine: submarine };
        }
    } 
    else {
        if(row + length <= board.length) {
            for(let i = 0; i < length; i++) {
                if(updatedBoard[row + i][col].submarine) return { updatedBoard, placedSubmarine: null };
            }
            for(let i = 0; i < length; i++) updatedBoard[row + i][col].submarine = submarine;
            return { updatedBoard, placedSubmarine: submarine };
        }
    }
    return { updatedBoard, placedSubmarine: null };
}
export function attack(
    board: BoardCell[][],
    row: number,
    col: number
) : {
    updatedBoard: BoardCell[][];
    hit: boolean;
} {
    const updatedBoard = [...board.map((row) => [...row])];
    const cell = updatedBoard[row][col];
    if(cell.isAttacked) return { updatedBoard, hit: false };
    cell.isAttacked = true;
    if(cell.submarine) {
        cell.isHit = true;
        cell.submarine.hits++;
        return { updatedBoard, hit: true };
    }
    return { updatedBoard, hit: false };
}