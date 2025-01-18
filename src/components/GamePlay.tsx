import { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import SubmarineSelection from './SubmarineSelection';
import { Player, GamePhase, Submarine, SubmarineType } from '../utils/types';
import { initialiseBoard, placeSubmarine, attack } from '../logic/game-logic';

const BOARD_SIZE = 10;
const SUBMARINE_TYPES: SubmarineType[] = [
  { id: 'ballistic', name: 'Ballistic Missile Submarine', length: 5, count: 1 },
  { id: 'cruise', name: 'Cruise Missile Submarine', length: 3, count: 2 },
  { id: 'midget', name: 'Midget Submarine', length: 2, count: 2 },
];

export default function SubmarineGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('placement');
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [player1Board, setPlayer1Board] = useState(initialiseBoard(BOARD_SIZE));
  const [player2Board, setPlayer2Board] = useState(initialiseBoard(BOARD_SIZE));
  const [player1Submarines, setPlayer1Submarines] = useState<Submarine[]>([]);
  const [player2Submarines, setPlayer2Submarines] = useState<Submarine[]>([]);
  const [selectedSubmarine, setSelectedSubmarine] = useState<Submarine | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [submarineOrientation, setSubmarineOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [availableSubmarines, setAvailableSubmarines] = useState<SubmarineType[]>(SUBMARINE_TYPES);

  const handleSubmarineSelection = (submarine: Submarine) => {
    setSelectedSubmarine(submarine);
  };

  const handleSubmarinePlacement = (row: number, col: number) => {
    if (!selectedSubmarine) return;

    const currentBoard = currentPlayer === 1 ? player1Board : player2Board;
    const currentSubmarines = currentPlayer === 1 ? player1Submarines : player2Submarines;

    const { updatedBoard, placedSubmarine } = placeSubmarine(currentBoard, selectedSubmarine, row, col, submarineOrientation);

    if (placedSubmarine) {
      if (currentPlayer === 1) {
        setPlayer1Board(updatedBoard);
        setPlayer1Submarines([...currentSubmarines, placedSubmarine]);
      } else {
        setPlayer2Board(updatedBoard);
        setPlayer2Submarines([...currentSubmarines, placedSubmarine]);
      }

      // Update available submarines
      const updatedAvailableSubmarines = availableSubmarines.map(sub =>
        sub.id === selectedSubmarine.id ? { ...sub, count: sub.count - 1 } : sub
      ).filter(sub => sub.count > 0);

      setAvailableSubmarines(updatedAvailableSubmarines);
      setSelectedSubmarine(null);

      if (updatedAvailableSubmarines.length === 0) {
        if (currentPlayer === 1) {
          setCurrentPlayer(2);
          setAvailableSubmarines(SUBMARINE_TYPES);
        } else {
          setGamePhase('attack');
          setCurrentPlayer(1);
        }
      }
    }
  };

  const handleAttack = (row: number, col: number) => {
    const targetBoard = currentPlayer === 1 ? player2Board : player1Board;
    const { updatedBoard, hit } = attack(targetBoard, row, col);

    if (currentPlayer === 1) {
      setPlayer2Board(updatedBoard);
    } else {
      setPlayer1Board(updatedBoard);
    }

    if (!hit) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }

    checkGameOver();
  };

  const checkGameOver = () => {
    const player1Lost = player1Submarines.every((sub) => sub.hits === sub.length);
    const player2Lost = player2Submarines.every((sub) => sub.hits === sub.length);

    if (player1Lost) setWinner(2);
    if (player2Lost) setWinner(1);
  };

  const toggleSubmarineOrientation = () => {
    setSubmarineOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  useEffect(() => {
    if (winner) {
      alert(`Player ${winner} wins!`);
    }
  }, [winner]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">⚔️ Royal Submarine Battle ⚔️</h1>
      {gamePhase === 'placement' && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Player {currentPlayer} - Place your submarines</h2>
          <SubmarineSelection
            submarines={availableSubmarines}
            onSelect={handleSubmarineSelection}
            selectedSubmarine={selectedSubmarine}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
            onClick={toggleSubmarineOrientation}
          >
            Orientation: {submarineOrientation}
          </button>
        </div>
      )}
      {gamePhase === 'attack' && (
        <h2 className="text-xl font-semibold mb-4">Player {currentPlayer}'s turn to attack</h2>
      )}
      <div className="flex space-x-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Player 1's Board</h3>
          <GameBoard
            board={player1Board}
            onCellClick={
              gamePhase === 'placement' && currentPlayer === 1
                ? handleSubmarinePlacement
                : gamePhase === 'attack' && currentPlayer === 2
                ? handleAttack
                : undefined
            }
            showSubmarine={gamePhase === 'placement' && currentPlayer === 1}
            orientation={submarineOrientation}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Player 2's Board</h3>
          <GameBoard
            board={player2Board}
            onCellClick={
              gamePhase === 'placement' && currentPlayer === 2
                ? handleSubmarinePlacement
                : gamePhase === 'attack' && currentPlayer === 1
                ? handleAttack
                : undefined
            }
            showSubmarine={gamePhase === 'placement' && currentPlayer === 2}
            orientation={submarineOrientation}
          />
        </div>
      </div>
    </div>
  );
}

