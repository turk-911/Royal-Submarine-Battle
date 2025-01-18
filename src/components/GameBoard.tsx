import { GameBoardProps } from "../utils/types";

export default function GameBoard({
    board,
    onCellClick,
    showSubmarine,
    orientation,
}: GameBoardProps) {
    return (
        <div className="grid grid-cols-10 gap-0.5 bg-blue-300 p-0.5 rounded">
            {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} onClick={() => onCellClick && onCellClick(rowIndex, colIndex)}
                className={`w-8 h-8 flex items-center justify-center cursor-pointer ${cell.isHit ? 'bg-red-500': cell.isAttacked ? 'bg-blue-200': 'bg-blue-500'}`}>
                    {cell.isHit && '🔥'}
                    {cell.isAttacked && !cell.isHit && '🌊'}
                    {showSubmarine && cell.submarine && !cell.isHit && (
                        <div className={`submarine ${orientation}`}>
                            🚢
                        </div>
                    )} 
                    {!showSubmarine && cell.submarine && cell.submarine.hits === cell.submarine.length && '🚢'}
                </div>
            )))}
        </div>
    )
}