import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Paper,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import {
  PlayArrowOutlined as PlayArrowOutlinedIcon,
  PauseOutlined as PauseOutlinedIcon,
  RotateLeftOutlined as RotateLeftOutlinedIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectStatus,
  selectCellSize,
  selectGenerationSpeed,
  setStatus,
  setCellSize,
  setGenerationSpeed
} from './controlPanelSlice';
import {
  selectWorkspaceLiveCells,
  selectWorkspaceGeneration,
  clearCells,
  nextGeneration
} from '../workspace/workspaceSlice';

const SettingStatus = () => {

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const generationSpeed = useAppSelector(selectGenerationSpeed);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if(status === 'play') {
      playIntervalRef.current = setInterval(
        () => dispatch(nextGeneration()),
        1000 / generationSpeed
      );
    } else if(status === 'pause') {
      clearInterval(playIntervalRef.current as NodeJS.Timeout);
    }
  }, [dispatch, status, generationSpeed]);

  return (
    <ToggleButtonGroup
      value={status}
      color="primary"
      size="small"
      exclusive={true}
      onChange={(e, value) => {
        if(value === 'clear') {
          dispatch(setStatus('pause'));
          dispatch(clearCells());
        } else if(value === 'play' || value === 'pause') {
          dispatch(setStatus(value));
        }
      }}
      sx={{
        mb: 2,
        width: '100%',
        '& .MuiButtonBase-root': { width: '100%' }
      }}
    >
      <ToggleButton value="play">
        <PlayArrowOutlinedIcon /> Play
      </ToggleButton>
      <ToggleButton value="pause">
        <PauseOutlinedIcon /> Pause
      </ToggleButton>
      <ToggleButton value="clear">
        <RotateLeftOutlinedIcon /> Clear
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

const SettingGenerationSpeed = () => {

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const generationSpeed = useAppSelector(selectGenerationSpeed);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1">
        Generation speed (gen/sec)
      </Typography>
      <Box sx={{ pt: .5, px: 1 }}>
        <Slider
          onChangeCommitted={(e, value) =>
            dispatch(setGenerationSpeed(value as number))
          }
          marks={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' }
          ]}
          step={1}
          min={1}
          max={5}
          defaultValue={generationSpeed}
          key={generationSpeed}
          disabled={status === 'play'}
          valueLabelDisplay="off"
        />
      </Box>
    </Box>
  );
}

const SettingCellSize = () => {

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const cellSize = useAppSelector(selectCellSize);

  return (
    <Box>
      <Typography variant="subtitle1">
        Cell size (px)
      </Typography>
      <Box sx={{ pt: .5, px: 1 }}>
        <Slider
          onChangeCommitted={(e, value) =>
            dispatch(setCellSize(value as number))
          }
          marks={[
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 75, label: '75' },
            { value: 100, label: '100' }
          ]}
          step={25}
          min={25}
          max={100}
          defaultValue={cellSize}
          key={cellSize}
          disabled={status === 'play'}
          valueLabelDisplay="off"
        />
      </Box>
    </Box>
  );
}

const AutoPauseController = () => {

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const workspaceGeneration = useAppSelector(selectWorkspaceGeneration);
  const workspaceLiveCells = useAppSelector(selectWorkspaceLiveCells);
  const [previousLiveCells, setPreviousLiveCells] = useState({ cells: '[]', generation: 0 });

  useEffect(() => {
    if(status === 'play') {
      // Pause when there are no live cells
      if(workspaceLiveCells.length === 0) {
        dispatch(setStatus('pause'));
      }
      // Pause when there is no change from the previous state
      if(previousLiveCells.generation !== workspaceGeneration) {
        let workspaceLiveCellsStringify = JSON.stringify(workspaceLiveCells);
        if(previousLiveCells.cells === workspaceLiveCellsStringify) {
          dispatch(setStatus('pause'));
        } else {
          setPreviousLiveCells({
            cells: workspaceLiveCellsStringify,
            generation: workspaceGeneration
          });
        }
      }
    }
  }, [
    dispatch,
    status,
    workspaceGeneration,
    previousLiveCells,
    workspaceLiveCells
  ]);

  return <></>;
}

const ControlPanel = () => {

  const Header = () => {
    return (
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold' }}
        >
          Game of Life
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Control panel
        </Typography>
      </Box>
    );
  }

  const Dashboard = () => {

    const workspaceGeneration = useAppSelector(selectWorkspaceGeneration);
    const workspaceLiveCells = useAppSelector(selectWorkspaceLiveCells);

    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, pt: 2 }}
      >
        <TextField
          label="Generation"
          variant="outlined"
          size="small"
          fullWidth={true}
          value={workspaceGeneration}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Live cells"
          variant="outlined"
          size="small"
          fullWidth={true}
          value={workspaceLiveCells.length}
          InputProps={{ readOnly: true }}
        />
      </Stack>
    );
  }

  const Settings = () => {
    return (
      <Box sx={{ p: 2 }}>
        <SettingStatus />
        <SettingGenerationSpeed />
        <SettingCellSize />
      </Box>
    );
  }

  const Buttons = () => {

    const [rulesModalOpen, setRulesModalOpen] = useState(false);

    const toggleRulesModal = () => setRulesModalOpen(!rulesModalOpen);

    return (
      <Box sx={{ p: 2 }}>
        <Button
          onClick={toggleRulesModal}
          variant="outlined"
          sx={{ width: '100%', mb: 2 }}
        >
          Game Rules
        </Button>
        <Dialog
          maxWidth="md"
          open={rulesModalOpen}
          onClose={toggleRulesModal}
        >
          <DialogTitle>
           Game rules
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body1" component="span">
                1. Any live cell with two or three live neighbours survives.<br />
                2. Any dead cell with three live neighbours becomes a live cell.<br />
                3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleRulesModal} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns"
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          sx={{ width: '100%' }}
        >
          <OpenInNewIcon
            fontSize="small"
            sx={{ mr: .5 }}
          />
          Examples
        </Button>
      </Box>
    );
  }

  const Credits = () => {
    return (
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <Typography
          variant="caption"
          component="p"
          sx={{ px: 2, py: 1 }}
        >
          Application created by{' '}
          <Link
            href="https://github.com/mickrzyzak/game-of-life"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            mickrzyzak
          </Link>
          {' '}on&nbsp;GitHub
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      variant="outlined"
      square={true}
      sx={{
        ml: { xs: '0', sm: 'auto' },
        mt: { xs: 'auto', sm: '0' }
      }}
    >
      <Stack sx={{
        maxWidth: { xs: '100%', sm: 360 },
        overflowY: 'auto',
        height: '100%'
      }}>
        <Header />
        <Divider />
        <AutoPauseController />
        <Dashboard />
        <Settings />
        <Divider />
        <Buttons />
        <Credits />
      </Stack>
    </Paper>
  );
}

export default ControlPanel;
