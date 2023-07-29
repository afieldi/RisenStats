import React, { useState } from 'react';
import { Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material';
import { TabPanel } from '../../components/tab-panel/tab-panel';
import WeeklyBest from '../../components/graphics/weekly-best';

export default function statGraphic() {
  const theme = useTheme();
  const [exportItem, setExportItem] = useState<number>(1);

  const handleChange = (event: SelectChangeEvent) => {
    setExportItem(Number.parseInt(event.target.value));
  };
  return (
    <Container sx={{ pt: 10, pb: 10, minHeight: '100vh', color: theme.palette.info.light }}>
      <Box>
        <Typography variant="h1">
          Stat Graphic Creation
        </Typography>
      </Box>
      <hr></hr>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Box>
          <Typography>
            Please select the type of graphic you want generated
          </Typography>
          <ol>
            <li>
              <Typography textAlign="left">
                Best Weekly Players:
              </Typography>
            </li>
            <li>
              <Typography textAlign="left">
                Champion Sheet: Exports a CSV champion data for the specified season.
              </Typography>
            </li>
            <li>
              <Typography textAlign="left">
                Season Players: Exports a CSV for player average game data filtered by season and optionally role.
              </Typography>
            </li>
          </ol>
        </Box>
        <hr></hr>
        <Box>
          <FormControl sx={{ minWidth: '300px' }}>
            <InputLabel id="demo-simple-select-label">Export Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={exportItem.toString()}
              label="Export Type"
              onChange={handleChange}
            >
              <MenuItem value={1}>Best Weekly Players</MenuItem>
              <MenuItem value={2} disabled>TBD</MenuItem>
              <MenuItem value={3} disabled>TBD</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <hr></hr>
      <TabPanel value={exportItem} index={1}>
        <WeeklyBest />
      </TabPanel>
    </Container>
  );
}