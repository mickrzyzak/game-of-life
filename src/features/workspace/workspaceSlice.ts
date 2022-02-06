import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface WorkspaceState {
  size: { x: number, y: number };
  generation: number;
  liveCells: Array<{ x: number, y: number }>;
}

const initialState: WorkspaceState = {
  size: { x: 0, y: 0 },
  generation: 0,
  liveCells: []
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setSize: (state, action: PayloadAction<{ x: number, y: number }>) => {
      state.size = action.payload;
      state.liveCells = [];
      state.generation = 0;
    },
    setPattern: (state, action: PayloadAction<
      { size: { x: number, y: number }, json: string }
    >) => {
      let liveCells = JSON.parse(action.payload.json);
      let offset = {
        x: Math.floor((state.size.x - action.payload.size.x) / 2),
        y: Math.floor((state.size.y - action.payload.size.y) / 2)
      };
      liveCells = liveCells.map((cell: { x: number, y: number }) => {
        return { x: cell.x + offset.x, y: cell.y + offset.y };
      });
      state.liveCells = liveCells;
      state.generation = 0;
    },
    setLiveCell: (state, action: PayloadAction<{ x: number, y: number }>) => {
      if(state.liveCells.findIndex(
        cell => cell.x === action.payload.x && cell.y === action.payload.y
      ) === -1) {
        state.liveCells.push({ x: action.payload.x, y: action.payload.y });
      }
    },
    removeLiveCell: (state, action: PayloadAction<{ x: number, y: number }>) => {
      state.liveCells = state.liveCells.filter(
        cell => cell.x !== action.payload.x || cell.y !== action.payload.y
      );
    },
    clearCells: (state) => {
      state.liveCells = [];
      state.generation = 0;
    },
    nextGeneration: (state) => {
      let liveCells = [];
      // Create a matrix
      let matrix: Array<Array<number>> = [];
      for(let i = 0; i < state.size.y; i++) {
        let rows = [];
        for(let ii = 0; ii < state.size.x; ii++) {
          rows[ii] = 0;
        }
        matrix[i] = rows;
      }
      // Put live cells on the matrix
      state.liveCells.forEach(cell => {
        matrix[cell.y][cell.x] = 1;
      });
      // Count cell neighbors and set cell statuses
      for(let y = 0; y < state.size.y; y++) {
        for(let x = 0; x < state.size.x; x++) {
          let neighbors = 0;
          let isAlive = matrix[y][x] === 1 ? true : false;
          // Top
          if(y > 0
            && matrix[y - 1][x] === 1) neighbors++;
          // Top-right
          if(y > 0 && x + 1 < state.size.x
            && matrix[y - 1][x + 1] === 1) neighbors++;
          // Right
          if(x + 1 < state.size.x
            && matrix[y][x + 1] === 1) neighbors++;
          // Right-bottom
          if(x + 1 < state.size.x && y + 1 < state.size.y
            && matrix[y + 1][x + 1] === 1) neighbors++;
          // Bottom
          if(y + 1 < state.size.y
            && matrix[y + 1][x] === 1) neighbors++;
          // Bottom-left
          if(y + 1 < state.size.y && x > 0
            && matrix[y + 1][x - 1] === 1) neighbors++;
          // Left
          if(x > 0
            && matrix[y][x - 1] === 1) neighbors++;
          // Left-top
          if(x > 0 && y > 0
            && matrix[y - 1][x - 1] === 1) neighbors++;
          // Rule 1
          if(!isAlive && neighbors === 3) {
            liveCells.push({ x, y });
          }
          // Rule 2
          if(isAlive && (neighbors === 2 || neighbors === 3)) {
            liveCells.push({ x, y });
          }
        }
      }
      // Set new live cells
      state.liveCells = liveCells;
      state.generation = state.generation + 1;
    }
  }
});

export const {
  setSize,
  setPattern,
  setLiveCell,
  removeLiveCell,
  clearCells,
  nextGeneration
} = workspaceSlice.actions;

export const selectWorkspaceSize = (state: RootState) => state.workspace.size;
export const selectWorkspaceGeneration = (state: RootState) => state.workspace.generation;
export const selectWorkspaceLiveCells = (state: RootState) => state.workspace.liveCells;

export default workspaceSlice.reducer;
