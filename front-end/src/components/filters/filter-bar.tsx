import React from "react";
import { Box, SelectChangeEvent } from "@mui/material";
import RisenSeasonSelector from "../selectors/risen-season-selector";
import RoleSelector from "../selectors/role-selector";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import SeasonModel from "../../../../Common/models/season.model";

export interface FilterBarProps {
  seasonConfig?: {
    seasonId: string,
    setSeasonId: (seasonId: string) => void,
    seasons?: SeasonModel[],
  };
  roleConfig?: {
    roleId: GameRoles,
    setRoleId: (roleId: GameRoles) => void,
  };
  hideAllGames?: boolean;
  children?: React.ReactNode;
}

export default function FilterBar(props: FilterBarProps) {
  return (
    <Box sx={{display: 'flex', columnGap: 2}}>
      <Box>
        <RisenSeasonSelector
          callBack={(event: SelectChangeEvent) => { props.seasonConfig?.setSeasonId(event.target.value) }}
          sx={{ minWidth: '200px', pt: 1, pb: 1 }}
          seasonConfig={props.seasonConfig}
          hideAllGames={!!props.hideAllGames} />
      </Box>
      <Box>
        <RoleSelector
          sx={{ minWidth: '150px', pt: 1, pb: 1 }}
          initalValue={props.roleConfig?.roleId}
          callBack={(event: SelectChangeEvent) => { props.roleConfig?.setRoleId(GameRoles[event.target.value as keyof typeof GameRoles]) }}
        />
      </Box>
      {props.children}
    </Box>
  );
}