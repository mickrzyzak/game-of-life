import React from 'react';
import { Stack } from '@mui/material';
import Workspace from '../features/workspace/Workspace';
import ControlPanel from '../features/control-panel/ControlPanel';

const App = () => {
  return (
    <Stack
      spacing={0}
      sx={{
        height: '100vh',
        maxHeight: '100vh',
        flexDirection: { xs: 'column', sm: 'row' }
      }}
    >
      <Workspace />
      <ControlPanel />
    </Stack>
  );
}

export default App;
