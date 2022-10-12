import React from "react";
import RisenBox1 from "../risen-box/risen-box-1";
import SeasonModel from "../../../../Common/models/season.model";
import { Container, Grid, Box, Hidden, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Theme, SxProps } from "@mui/material";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";

export interface GamesFilterOptions {
  seasonId: string;
  championId: string;
  roleId: string;
}

interface Props {
  sx?: SxProps<Theme> | undefined;
  useSeason?: boolean;
  seasonConfig?: {
    seasonId: string,
    setSeasonId: (seasonId: string) => void,
    seasons?: SeasonModel[],
  };

  useChampion?: boolean;
  useRole?: boolean;
  roleConfig?: {
    roleId: GameRoles,
    setRoleId: (roleId: GameRoles) => void,
  }
}

export default function GamesFilter(props: Props) {
  return (
    <RisenBox1 title="Filters" sx={props.sx}>
      {
        props.useSeason ? <FormControl sx={{minWidth: '300px', pt: 1, pb: 1}}>
          <InputLabel id="season-filter-select-label">Season</InputLabel>
          <Select
            labelId="season-filter-select-label"
            id="season-simple-select"
            value={props.seasonConfig?.seasonId}
            label="Season"
            onChange={(event: SelectChangeEvent) => {props.seasonConfig?.setSeasonId(event.target.value)}}
          >
            <MenuItem value="ALL">All Tournament Games</MenuItem>
            <MenuItem value="RISEN">All Risen Games</MenuItem>
            {
              props.seasonConfig?.seasons?.map(season => (
                <MenuItem value={season.id}>{season.seasonName}</MenuItem>
              ))
            }
          </Select>
        </FormControl> : null
      }
      {
        props.useRole ? <FormControl sx={{minWidth: '300px', pt: 1, pb: 1}}>
        <InputLabel id="role-filter-select-label">Role</InputLabel>
        <Select
          labelId="role-filter-select-label"
          id="role-simple-select"
          value={props.roleConfig?.roleId}
          label="Role"
          onChange={(event: SelectChangeEvent) => {console.log(event.target.value); props.roleConfig?.setRoleId(GameRoles[event.target.value as keyof typeof GameRoles])}}
        >
          <MenuItem value={GameRoles.ALL}>All</MenuItem>
          <MenuItem value={GameRoles.TOP}>Top</MenuItem>
          <MenuItem value={GameRoles.JUNGLE}>Jungle</MenuItem>
          <MenuItem value={GameRoles.MIDDLE}>Middle</MenuItem>
          <MenuItem value={GameRoles.BOTTOM}>Bottom</MenuItem>
          <MenuItem value={GameRoles.SUPPORT}>Support</MenuItem>
        </Select>
      </FormControl> : null
      }
    </RisenBox1>
  )
}