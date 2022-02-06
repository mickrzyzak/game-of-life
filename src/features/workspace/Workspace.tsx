import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import {
  Box,
  Stack
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCellSize } from '../control-panel/controlPanelSlice';
import {
  selectWorkspaceSize,
  selectWorkspaceLiveCells,
  setSize,
  setPattern,
  setLiveCell,
  removeLiveCell
} from './workspaceSlice';

const LiveCells = () => {

  const dispatch = useAppDispatch();
  const cellSize = useAppSelector(selectCellSize);
  const workspaceLiveCells = useAppSelector(selectWorkspaceLiveCells);

  const liveCells = workspaceLiveCells.map(
    (cell, key) =>
    <Box
      key={key}
      onClick={() => {
        dispatch(removeLiveCell({ x: cell.x, y: cell.y }));
      }}
      sx={{
        position: 'absolute',
        left: cellSize * cell.x,
        top: cellSize * cell.y,
        width: cellSize - 1,
        height: cellSize - 1,
        backgroundColor: 'secondary.main',
        cursor: 'pointer'
      }}
    />
  );

  return <>{liveCells}</>;
}

const GridCells = () => {

  const dispatch = useAppDispatch();
  const cellSize = useAppSelector(selectCellSize);
  const workspaceSize = useAppSelector(selectWorkspaceSize);

  let rows: Array<JSX.Element> = [];
  for(let y = 0; y < workspaceSize.y; y++) {
    let cols: Array<JSX.Element> = [];
    for(let x = 0; x < workspaceSize.x; x++) {
      cols.push(
        <Box
          key={x}
          onClick={() => {
            dispatch(setLiveCell({ x, y }));
          }}
          sx={{
            width: cellSize - 1,
            height: cellSize - 1,
            borderBottom: 1,
            borderRight: 1,
            borderColor: 'text.disabled',
            backgroundColor: 'white',
            '&:hover': {
              opacity: .5,
              cursor: 'pointer'
            }
          }}
        />
      );
    }
    rows.push(
      <Stack direction="row" key={y}>
        {cols}
      </Stack>
    );
  }

  return <>{rows}</>;
}

const Workspace = () => {

  const dispatch = useAppDispatch();
  const cellSize = useAppSelector(selectCellSize);
  const workspaceSize = useAppSelector(selectWorkspaceSize);
  const workspaceRef = useRef<HTMLElement>(null);
  const [initialState, setInitialState] = useState<boolean>(false);

  const updateWorkspaceSize = useCallback(() => {
    if(workspaceRef.current && workspaceRef.current.clientHeight) {
      let workspace = workspaceRef.current;
      dispatch(setSize({
        x: Math.floor(workspace.clientWidth / cellSize) - 1,
        y: Math.floor(workspace.clientHeight / cellSize) - 1
      }));
    }
  }, [dispatch, cellSize]);

  useEffect(() => {
    updateWorkspaceSize();
    window.addEventListener('resize', updateWorkspaceSize);
    return () => window.removeEventListener('resize', updateWorkspaceSize);
  }, [updateWorkspaceSize]);

  useEffect(() => {
    if(!initialState) {
      let initialPattern: { size: { x: number, y: number }, json: string } | null = null;
      const desktopInitialPattern = {
        size: { x: 16, y: 9 },
        json: '[{"x":3,"y":2},{"x":4,"y":2},{"x":4,"y":4},{"x":3,"y":4},{"x":3,"y":6},{"x":4,"y":6},{"x":5,"y":3},{"x":5,"y":4},{"x":5,"y":5},{"x":6,"y":4},{"x":2,"y":4},{"x":2,"y":3},{"x":2,"y":5},{"x":1,"y":4},{"x":9,"y":4},{"x":10,"y":4},{"x":11,"y":4},{"x":12,"y":4},{"x":13,"y":4},{"x":14,"y":4},{"x":11,"y":2},{"x":12,"y":2},{"x":11,"y":6},{"x":12,"y":6},{"x":13,"y":5},{"x":13,"y":3},{"x":10,"y":3},{"x":10,"y":5}]'
      };
      const mobileInitialPattern = {
        size: { x: 8, y: 8 },
        json: '[{"x":2,"y":1},{"x":1,"y":2},{"x":3,"y":2},{"x":4,"y":2},{"x":2,"y":3},{"x":2,"y":4},{"x":3,"y":5},{"x":4,"y":5},{"x":5,"y":4},{"x":5,"y":3},{"x":5,"y":1},{"x":6,"y":2},{"x":6,"y":5},{"x":5,"y":6},{"x":2,"y":6},{"x":1,"y":5}]'
      };
      if(workspaceSize.x >= desktopInitialPattern.size.x
      && workspaceSize.y >= desktopInitialPattern.size.y) {
        initialPattern = desktopInitialPattern;
      } else if(workspaceSize.x >= mobileInitialPattern.size.x
      && workspaceSize.y >= mobileInitialPattern.size.y) {
        initialPattern = mobileInitialPattern;
      }
      if(initialPattern !== null) {
        dispatch(setPattern(initialPattern));
        setInitialState(true);
      }
    }
  }, [dispatch, initialState, workspaceSize]);

  return (
    <Box
      ref={workspaceRef}
      sx={{
        width: '100%',
        minHeight: 400,
        overflow: 'hidden',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'text.disabled'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <GridCells />
        <LiveCells />
      </Box>
    </Box>
  );
}

export default Workspace;
