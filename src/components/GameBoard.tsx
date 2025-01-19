import { AnimatePresence, motion } from "framer-motion";
import { GameBoardProps } from "../utils/types";
import { useState } from "react";

export default function GameBoard({
  board,
  onCellClick,
  showSubmarine,
  orientation,
  gamePhase
}: GameBoardProps) {
    const [bombPosition, setBombPosition] = useState<{row: number, col: number} | null>(null);
    const handleCellClick = (row: number, col: number) => {
      if(onCellClick) {
        if(gamePhase === 'attack') {
          setBombPosition({ row, col });
          setTimeout(() => {
            onCellClick(row, col);
            setBombPosition(null);
          }, 1000);
        } else {
          onCellClick(row, col);
        }
      }
    }
  return (
    <div className="relative">
      <div className="grid grid-cols-10 gap-0.5 bg-blue-300 p-0.5 rounded">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                cell.isHit
                  ? "bg-red-500"
                  : cell.isAttacked
                  ? "bg-blue-200"
                  : "bg-blue-500"
              }`}
            >
              {cell.isHit && "🔥"}
              {cell.isAttacked && !cell.isHit && "🌊"}
              {showSubmarine && cell.submarine && !cell.isHit && (
                <div className={`submarine ${orientation}`}>🚢</div>
              )}
              {!showSubmarine &&
                cell.submarine &&
                cell.submarine.hits === cell.submarine.length &&
                "🚢"}
            </div>
          ))
        )}
      </div>
      <AnimatePresence>
        {bombPosition && (
          <motion.div
            className="absolute w-6 h-6 bg-black rounded-full flex items-center justify-center text-white"
            style={{
              top: `${bombPosition.row * 32 + 10}px`,
              left: `${bombPosition.col * 32 + 10}px`,
            }}
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
          >
            💣
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
