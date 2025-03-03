import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  makeMove,
  undoMove,
  redoMove,
  resetGame,
  startReplay,
  nextReplayStep,
  stopReplay,
  setBoardSize,
} from "../store/gameSlice";
import Button from "../components/Button";
import { motion } from "framer-motion";

const TicTacToe: React.FC = () => {
  const dispatch = useDispatch();
  const { board, history, step, winner, currentPlayer, winningLine, isReplaying, boardSize } = useSelector(
    (state: RootState) => state.game
  );
  const [replayStep, setReplayStep] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isReplaying) {
      let step = 0;
      intervalRef.current = setInterval(() => {
        if (step < history.length - 1) {
          dispatch(nextReplayStep());
          step++;
        } else {
          clearInterval(intervalRef.current!);
          dispatch(stopReplay());
        }
      }, 800);
      return () => clearInterval(intervalRef.current!);
    }
  }, [isReplaying, history.length, dispatch]);

  useEffect(() => {
    if (isReplaying && replayStep < history.length) {
      dispatch(nextReplayStep());
    }
  }, [replayStep, isReplaying, dispatch, history.length]);

  const handleClick = (index: number) => {
    if (!board[index] && !winner && !isReplaying) {
      dispatch(makeMove(index));
    }
  };

  const startReplayGame = () => {
    setTimeout(() => {
      dispatch(startReplay());
      setReplayStep(0);
    }, 100);
  };

  const getGameStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (step === boardSize * boardSize) return "Draw!";
    return `Game in Progress - Current Turn: ${currentPlayer}`;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Tic-Tac-Toe</h1>
      <div className="mb-4">
        <label className="mr-2">Board Size:</label>
        <select
          value={boardSize}
          onChange={(e) => dispatch(setBoardSize(Number(e.target.value)))}
          disabled={isReplaying}
        >
          {[3, 4, 5].map((size) => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>
      </div>
      <div className={`grid grid-cols-${boardSize} gap-2`} style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
        {(isReplaying ? [...history[step]] : board).map((cell, index) => (
         <motion.button
         key={index}
         onMouseDown={(e) => {
           e.preventDefault(); // Ensures immediate event execution
           handleClick(index);
         }}
         className={`w-16 h-16 text-2xl flex items-center justify-center border transition-colors duration-300 ${
           winningLine.includes(index) ? "bg-green-300" : ""
         } relative select-none pointer-events-auto`}
         whileTap={{ scale: 0.8 }}
         initial={{ scale: 1 }}
         animate={{ scale: 1 }}
         transition={{ type: "spring", stiffness: 200 }}
         disabled={isReplaying}
       >
         <span className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
           {cell}
         </span>
       </motion.button>
       
        ))}
      </div>
      <p className="mt-4 font-semibold">{getGameStatus()}</p>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => dispatch(undoMove())} disabled={step === 0 || isReplaying}>
          Undo
        </Button>
        <Button onClick={() => dispatch(redoMove())} disabled={step >= history.length - 1 || isReplaying}>
          Redo
        </Button>
        <Button onClick={() => dispatch(resetGame())} disabled={isReplaying}>
          New Game
        </Button>
        {winner && (
          <Button onClick={startReplayGame} disabled={isReplaying}>
            Replay Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
