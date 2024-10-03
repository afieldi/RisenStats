import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import React from 'react';
import SeasonModel from '../../../../Common/models/season.model';
import { DEFAULT_RISEN_SEASON_ID } from '../../../../Common/constants';

export interface RisenSeasonSelectorProps {
    callBack?: (event: SelectChangeEvent) => any
    sx?: SxProps<Theme>
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
        hiddenSeasons?: SeasonModel[],
    };
    hideAllGames?: boolean;
    hideAllRisenGames?: boolean;
    error?: boolean;
}

export default function RisenSeasonSelector(props: RisenSeasonSelectorProps) {
  return (
    <FormControl sx={props.sx}>
      <InputLabel id="season-filter-select-label">Season</InputLabel>
      <Select
        labelId="season-filter-select-label"
        id="season-simple-select"
        value={props.seasonConfig?.seasonId}
        label="Season"
        onChange={props.callBack ?? ((event) => props.seasonConfig?.setSeasonId(event.target.value))}
        sx={{ overflow: 'hidden', width: '100%' }}
        error={props.error}
      >
        {!props.hideAllRisenGames && <MenuItem value={DEFAULT_RISEN_SEASON_ID}>All Risen Games</MenuItem>}
        {
          props.seasonConfig?.seasons?.map((season, index) => (
            <MenuItem key={index} value={season.id} hidden={!season.active}>{season.seasonName}</MenuItem>
          ))
        }

        {!props.hideAllGames && <MenuItem value="ALL">All Tournament Games</MenuItem>}
      </Select>
    </FormControl>
  );
}