import React, { useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import SeasonModel from '../../../../Common/models/season.model';
import { GetActiveSeasons } from '../../api/season';
import { useEffect } from 'react';
import LoadingButton from '../../components/loading-button/LoadingButton';
import { GetChampionStatsSheet } from '../../api/statExport';
import { SaveBlob } from '../../common/utils';

export default function ChampionSheetExport() {
  const [season, setSeason] = useState<string>('RISEN');
  const [activeSeasons, setActiveSeasons] = useState<SeasonModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetActiveSeasons().then(seasons => {
      setActiveSeasons(seasons.seasons);
    });
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSeason(event.target.value);
  };


  const handleClick = async() => {
    setLoading(true);
    const data = await GetChampionStatsSheet(season);

    SaveBlob(data, 'text.csv');
    setLoading(false);
  };


  return (
    <Box>
      <Box>
        <Typography variant="h2" sx={{ pb: 1 }}>
          Champion Stats Export
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Box sx={{ pr: 2 }}>
          <FormControl sx={{ minWidth: '300px' }}>
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={season.toString()}
              label="Season"
              onChange={handleChange}
            >
              {/* <MenuItem value={"ALL"}>All Seasons</MenuItem> */}
              <MenuItem value={'RISEN'}>Risen Seasons</MenuItem>
              {
                activeSeasons.map(s => <MenuItem value={s.id}>{s.seasonName}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Box>
        <LoadingButton variant='outlined' sx={{ width: '250px' }} onClick={handleClick} loading={loading}>
            Download
        </LoadingButton>
      </Box>
    </Box>
  );
}