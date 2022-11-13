import {Grid, SelectChangeEvent} from "@mui/material";
import RisenSeasonSelector from "../../selectors/risen-season-selector";
import RoleSelector from "../../selectors/role-selector";
import {GameRoles} from "../../../../../Common/Interface/General/gameEnums";
import React from "react";
import SeasonModel from "../../../../../Common/models/season.model";

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
}

export default function FilterBar(props: FilterBarProps) {
    return (
        <Grid spacing={2} container>
            <Grid item>
                <RisenSeasonSelector
                    callBack={(event: SelectChangeEvent) => {props.seasonConfig?.setSeasonId(event.target.value)}}
                    sx={{minWidth: '200px', pt: 1, pb: 1}}
                    seasonConfig={props.seasonConfig}
                    hideAllGames={!!props.hideAllGames}/>
            </Grid>
            <Grid item>
                <RoleSelector
                    sx={{minWidth: '150px', pt: 1, pb: 1}}
                    initalValue={props.roleConfig?.roleId}
                    callBack={(event: SelectChangeEvent) => {props.roleConfig?.setRoleId(GameRoles[event.target.value as keyof typeof GameRoles]) }}
                />
            </Grid>
        </Grid>
    );
}