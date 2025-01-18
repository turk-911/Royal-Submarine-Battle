export type Player = 1 | 2
export type GamePhase = 'placement' | 'attack'
export interface Submarine {
    id: string;
    name: string;
    length: number;
    hits: number;
  }
export interface SubmarineType {
    id: string;
    name: string;
    length: number;
    count: number;
  }
export interface BoardCell {
    isHit: boolean
    isAttacked: boolean
    submarine: Submarine | null
}
export interface GameBoardProps {
    board: BoardCell[][];
    onCellClick?: (row: number, col: number) => void;
    showSubmarine: boolean;
    orientation: 'horizontal' | 'vertical';
};
export interface SubmarineSelectionProps {
    submarines: {
        id: string;
        length: number;
        count: number;
        name: string;
    }[];
    onSelect: (submarine: Submarine) => void;
    selectedSubmarine: Submarine | null;
}