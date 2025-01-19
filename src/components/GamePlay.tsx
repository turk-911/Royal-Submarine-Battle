import { useState, useEffect } from "react";
import GameBoard from "./GameBoard";
import SubmarineSelection from "./SubmarineSelection";
import { Player, GamePhase, Submarine, SubmarineType } from "../utils/types";
import { initialiseBoard, placeSubmarine, attack } from "../logic/game-logic";
import HowToPlay from "./HowToPlay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog-ui";
import { Button } from "./ui/button";

const BOARD_SIZE = 10;
const SUBMARINE_TYPES: SubmarineType[] = [
  { id: "ballistic", name: "Ballistic Missile Submarine", length: 5, count: 1 },
  { id: "cruise", name: "Cruise Missile Submarine", length: 3, count: 2 },
  { id: "midget", name: "Midget Submarine", length: 2, count: 2 },
];

export default function SubmarineGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("placement");
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [player1Board, setPlayer1Board] = useState(initialiseBoard(BOARD_SIZE));
  const [player2Board, setPlayer2Board] = useState(initialiseBoard(BOARD_SIZE));
  const [player1Submarines, setPlayer1Submarines] = useState<Submarine[]>([]);
  const [player2Submarines, setPlayer2Submarines] = useState<Submarine[]>([]);
  const [selectedSubmarine, setSelectedSubmarine] = useState<Submarine | null>(
    null
  );
  const [winner, setWinner] = useState<Player | null>(null);
  const [submarineOrientation, setSubmarineOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");
  const [availableSubmarines, setAvailableSubmarines] =
    useState<SubmarineType[]>(SUBMARINE_TYPES);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditOption, setShowEditOption] = useState(false);
  const [activeTab, setActiveTab] = useState("game");
  const handleSubmarineSelection = (submarine: Submarine) => {
    setSelectedSubmarine(submarine);
  };

  const handleSubmarinePlacement = (row: number, col: number) => {
    if (!selectedSubmarine) return;

    const currentBoard = currentPlayer === 1 ? player1Board : player2Board;
    const currentSubmarines =
      currentPlayer === 1 ? player1Submarines : player2Submarines;

    const { updatedBoard, placedSubmarine } = placeSubmarine(
      currentBoard,
      selectedSubmarine,
      row,
      col,
      submarineOrientation
    );

    if (placedSubmarine) {
      if (currentPlayer === 1) {
        setPlayer1Board(updatedBoard);
        setPlayer1Submarines([...currentSubmarines, placedSubmarine]);
      } else {
        setPlayer2Board(updatedBoard);
        setPlayer2Submarines([...currentSubmarines, placedSubmarine]);
      }

      const updatedAvailableSubmarines = availableSubmarines
        .map((sub) =>
          sub.id === selectedSubmarine.id
            ? { ...sub, count: sub.count - 1 }
            : sub
        )
        .filter((sub) => sub.count > 0);

      setAvailableSubmarines(updatedAvailableSubmarines);
      setSelectedSubmarine(null);

      if (updatedAvailableSubmarines.length === 0) {
        if (currentPlayer === 1) {
          setCurrentPlayer(2);
          setAvailableSubmarines(SUBMARINE_TYPES);
        } else {
          setGamePhase("attack");
          setCurrentPlayer(1);
        }
      }
    }
  };

  const handleConfirmPlacement = () => {
    setShowConfirmation(false);
    setGamePhase("attack");
    setCurrentPlayer(1);
  };

  const handleEditPlacement = () => {
    setShowEditOption(false);
    setCurrentPlayer(1);
    setPlayer1Board(initialiseBoard(BOARD_SIZE));
    setPlayer1Submarines([]);
    setAvailableSubmarines(SUBMARINE_TYPES);
  };

  const handleConfirmEdit = () => {
    setShowEditOption(false);
    setCurrentPlayer(2);
    setAvailableSubmarines(SUBMARINE_TYPES);
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
      const audio = new Audio("/water-audio.mp3");
      audio.play();
    }

    if (hit) {
      const audio = new Audio("/bomb-audio.wav");
      audio.play();
    }

    checkGameOver();
  };

  const checkGameOver = () => {
    const player1Lost = player1Submarines.every(
      (sub) => sub.hits === sub.length
    );
    const player2Lost = player2Submarines.every(
      (sub) => sub.hits === sub.length
    );

    if (player1Lost) setWinner(2);
    if (player2Lost) setWinner(1);
  };

  const toggleSubmarineOrientation = () => {
    setSubmarineOrientation((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal"
    );
  };

  useEffect(() => {
    if (winner) {
      alert(`Player ${winner} wins!`);
    }
  }, [winner]);

  return (
    <>
      <header className="w-full text-white p-4 bg-blue-100">
        <nav className="max-w-4xl mx-auto flex justify-center gap-8">
          <button
            className={`px-6 py-2 ${
              activeTab === "game" ? "bg-blue-600" : "bg-gray-600"
            } rounded-lg hover:${
              activeTab === "game" ? "bg-blue-600" : "bg-gray-600"
            } transition-colors`}
            onClick={() => setActiveTab("game")}
          >
            War Zone
          </button>
          <button
            className={`px-6 py-2 ${
              activeTab === "instructions" ? "bg-blue-600" : "bg-gray-600"
            } rounded-lg hover:${
              activeTab === "instructions" ? "bg-blue-600" : "bg-gray-600"
            } transition-colors`}
            onClick={() => setActiveTab("instructions")}
          >
            How to Play
          </button>
        </nav>
      </header>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
        {activeTab === "game" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center">
              ⚔️ Royal Submarine Battle ⚔️
            </h1>
            {gamePhase === "placement" && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Player {currentPlayer} - Place your submarines
                </h2>
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
            {gamePhase === "attack" && (
              <h2 className="text-xl font-semibold mb-4">
                Player {currentPlayer}'s turn to attack
              </h2>
            )}
            <div className="flex space-x-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Player 1's Sea</h3>
                <GameBoard
                  board={player1Board}
                  onCellClick={
                    gamePhase === "placement" && currentPlayer === 1
                      ? handleSubmarinePlacement
                      : gamePhase === "attack" && currentPlayer === 2
                      ? handleAttack
                      : undefined
                  }
                  showSubmarine={
                    gamePhase === "placement" && currentPlayer === 1
                  }
                  orientation={submarineOrientation}
                  gamePhase={gamePhase}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Player 2's Sea</h3>
                <GameBoard
                  board={player2Board}
                  onCellClick={
                    gamePhase === "placement" && currentPlayer === 2
                      ? handleSubmarinePlacement
                      : gamePhase === "attack" && currentPlayer === 1
                      ? handleAttack
                      : undefined
                  }
                  showSubmarine={
                    gamePhase === "placement" && currentPlayer === 2
                  }
                  orientation={submarineOrientation}
                  gamePhase={gamePhase}
                />
              </div>
            </div>
            
          </>
        )}
        {activeTab === "instructions" && <HowToPlay />}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Submarine Placement</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to start the game with the current
                    submarine placement?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmPlacement}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showEditOption} onOpenChange={setShowEditOption}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Submarine Placement</DialogTitle>
                  <DialogDescription>
                    Do you want to edit your submarine placement or continue to
                    the next player?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={handleEditPlacement}>
                    Edit Placement
                  </Button>
                  <Button onClick={handleConfirmEdit}>
                    Continue to Next Player
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      </div>
    </>
  );
}
