import {Box, Grid} from "@mui/material";
import RisenSeasonSelector from "../../selectors/risen-season-selector";
import RoleSelector from "../../selectors/role-selector";
import {GameRoles} from "../../../../../Common/Interface/General/gameEnums";
import RisenBox1 from "../../risen-box/risen-box-1";
import PerformanceOverview from "./performance-overview";
import React from "react";
import {PlayerStat} from "../stats";
import SeasonModel from "../../../../../Common/models/season.model";

export interface FilterBarProps {
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
    };
}

export default function FilterBar(props: FilterBarProps) {
    return (
        <Grid spacing={2} container>
            <Grid item>
                <RisenSeasonSelector
                    callBack={() => {}}
                    sx={{minWidth: '200px', pt: 1, pb: 1}}
                    seasonConfig={props.seasonConfig}
                    hideAllGames={false}/>
            </Grid>
            <Grid item>
                <RoleSelector
                    sx={{minWidth: '150px', pt: 1, pb: 1}}
                    initalValue={GameRoles.ALL}
                    callBack={() => {}}
                />
            </Grid>
        </Grid>
    );
}