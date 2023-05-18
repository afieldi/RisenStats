import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { GetBasicSheetForPlayers } from '../../api/statExport';
import { SaveBlob } from '../../common/utils';
import LoadingButton from '../../components/loading-button/LoadingButton';

export default function BasicSheetExport() {
  const [value, setValue] = useState('');
  const [nGames, setNGames] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleGamesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNGames(Number.parseInt(event.target.value));
  };

  const handleClick = async() => {
    setLoading(true);
    const playerNames = value.split(/\,|\n/);
    const data = await GetBasicSheetForPlayers(playerNames, nGames);

    SaveBlob(data, 'text.csv');
    setLoading(false);
  };

  return (
    <Box>
      <Box>
        <Typography variant="h2" sx={{ pb: 1 }}>
          Player Averages Export
        </Typography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <TextField
          id="outlined-multiline-static"
          label="Player Names"
          multiline
          rows={2}
          value={value}
          onChange={handleChange}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <TextField
          id="outlined-multiline-static"
          label="Number of Games"
          multiline
          rows={2}
          type="number"
          value={nGames}
          onChange={handleGamesChange}
          sx={{ width: '150px', pr: 3 }}
        />
        <hr></hr>
        <LoadingButton sx={{ width: '250px', ml: 3 }} variant="outlined" onClick={handleClick} loading={loading}>
          Download
        </LoadingButton>
      </Box>
    </Box>
  );
}