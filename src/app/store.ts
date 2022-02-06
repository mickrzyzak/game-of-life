import { configureStore } from '@reduxjs/toolkit';
import controlPanelReducer from '../features/control-panel/controlPanelSlice';
import workspaceReducer from '../features/workspace/workspaceSlice';

export const store = configureStore({
  reducer: {
    settings: controlPanelReducer,
    workspace: workspaceReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
