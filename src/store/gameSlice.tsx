import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  board: string[];
  history: string[][];
  step: number;
  winner: string | null;
  currentPlayer: string;
  winningLine: number[];
  isReplaying: boolean;
  boardSize: number;
}

const defaultSize = 3;
const initialState: GameState = {
  board: Array(defaultSize * defaultSize).fill(""),
  history: [Array(defaultSize * defaultSize).fill("")],
  step: 0,
  winner: null,
  currentPlayer: "X",
  winningLine: [],
  isReplaying: false,
  boardSize: defaultSize,
};

const checkWinner = (board: string[], size: number): { winner: string | null; line: number[] } => {
    let lines: number[][] = [];
  
    // Rows and Columns
    for (let i = 0; i < size; i++) {
      lines.push([...Array(size).keys()].map(j => i * size + j)); // Row
      lines.push([...Array(size).keys()].map(j => j * size + i)); // Column
    }
  
    // Diagonals
    lines.push([...Array(size).keys()].map(i => i * (size + 1))); // Main Diagonal
    lines.push([...Array(size).keys()].map(i => (i + 1) * (size - 1))); // Anti Diagonal
  
    for (let line of lines) {
      const [a, ...rest] = line;
      if (board[a] && rest.every(index => board[index] === board[a])) {
        return { winner: board[a], line };
      }
    }
    return { winner: null, line: [] };
  };

  
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setBoardSize: (state, action: PayloadAction<number>) => {
      state.boardSize = action.payload;
      state.board = Array(action.payload * action.payload).fill("");
      state.history = [Array(action.payload * action.payload).fill("")];
      state.step = 0;
      state.winner = null;
      state.currentPlayer = "X";
      state.winningLine = [];
      state.isReplaying = false;
    },
    makeMove: (state, action: PayloadAction<number>) => {
        if (state.board[action.payload] || state.winner || state.isReplaying) return;
        
        const newBoard = [...state.board];
        newBoard[action.payload] = state.currentPlayer;
        
        const { winner, line } = checkWinner(newBoard, state.boardSize);
      
        state.board = newBoard;
        state.history = [...state.history.slice(0, state.step + 1), [...newBoard]];
        state.step++;
        state.winner = winner;
        state.winningLine = line;
        state.currentPlayer = winner ? state.currentPlayer : state.currentPlayer === "X" ? "O" : "X";
      },
    undoMove: (state) => {
      if (state.step > 0 && !state.isReplaying) {
        state.step--;
        state.board = [...state.history[state.step]];
        state.winner = null;
        state.winningLine = [];
        state.currentPlayer = state.step % 2 === 0 ? "X" : "O";
      }
    },
    redoMove: (state) => {
      if (state.step < state.history.length - 1 && !state.isReplaying) {
        state.step++;
        state.board = [...state.history[state.step]];
        state.winner = null;
        state.winningLine = [];
        state.currentPlayer = state.step % 2 === 0 ? "X" : "O";
      }
    },
    resetGame: (state) => {
      state.board = Array(state.boardSize * state.boardSize).fill("");
      state.history = [Array(state.boardSize * state.boardSize).fill("")];
      state.step = 0;
      state.winner = null;
      state.currentPlayer = "X";
      state.winningLine = [];
      state.isReplaying = false;
    },
    startReplay: (state) => {
      if (state.history.length <= 1) return;
      state.isReplaying = true;
      state.step = 0;
      state.board = [...state.history[0]];
    },
    nextReplayStep: (state) => {
      if (state.isReplaying && state.step < state.history.length - 1) {
        state.step++;
        state.board = [...state.history[state.step]];
      } else {
        state.isReplaying = false;
      }
    },
    stopReplay: (state) => {
      state.isReplaying = false;
    },
  },
});

export const { setBoardSize, makeMove, undoMove, redoMove, resetGame, startReplay, nextReplayStep, stopReplay } = gameSlice.actions;
export default gameSlice.reducer;