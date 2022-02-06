import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ControlPanelState {
  status: 'play' | 'pause';
  cellSize: number;
  generationSpeed: number;
}

const initialState: ControlPanelState = {
  status: 'pause',
  cellSize: 25,
  generationSpeed: 1
};

export const controlPanelSlice = createSlice({
  name: 'control-panel',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<'play' | 'pause'>) => {
      state.status = action.payload;
    },
    setCellSize: (state, action: PayloadAction<number>) => {
      state.cellSize = action.payload;
    },
    setGenerationSpeed: (state, action: PayloadAction<number>) => {
      state.generationSpeed = action.payload;
    }
  }
});

export const {
  setStatus,
  setCellSize,
  setGenerationSpeed
 } = controlPanelSlice.actions;

export const selectStatus = (state: RootState) => state.settings.status;
export const selectCellSize = (state: RootState) => state.settings.cellSize;
export const selectGenerationSpeed = (state: RootState) => state.settings.generationSpeed;

export default controlPanelSlice.reducer;
