import React from "react";
import RisenBox1 from "../risen-box/risen-box-1";
import SeasonModel from "../../../../Common/models/season.model";
import { Container, Grid, Box, Hidden, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Theme, SxProps } from "@mui/material";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import RoleSelector from "../selectors/role-selector";
import RisenSeasonSelector from "../selectors/risen-season-selector";

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
  };

  hideAllGames?: boolean;
}

export default function GamesFilter(props: Props) {
  return (
    <RisenBox1 title="Filters" sx={{...props.sx}}>
      {
        props.useSeason && <RisenSeasonSelector
            callBack={(event: SelectChangeEvent) => {props.seasonConfig?.setSeasonId(event.target.value)}}
            sx={{width: '100%', pt: 1, pb: 1}}
            seasonConfig={props.seasonConfig}
            hideAllGames={!!props.hideAllGames}/>
      }
      {
          props.useRole && <RoleSelector
              initalValue={props.roleConfig?.roleId}
              sx={{width: '100%', pt: 1, pb: 1}}
              callBack={(event: SelectChangeEvent) => {
                              console.log(event.target.value);
                              props.roleConfig?.setRoleId(GameRoles[event.target.value as keyof typeof GameRoles])
              }}/>
      }
    </RisenBox1>
  )
}