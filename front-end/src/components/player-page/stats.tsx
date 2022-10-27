import React from "react";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Theme,
    Typography
} from "@mui/material";
import RisenBox1 from "../risen-box/risen-box-1";
import PerformanceOverview from "./stats/performance-overview";
import {GameRoles} from "../../../../Common/Interface/General/gameEnums";
import RoleSelector from "../selectors/role-selector";
import RisenSeasonSelector from "../selectors/risen-season-selector";
import SeasonModel from "../../../../Common/models/season.model";
import FilterBar from "./stats/filter-bar";

interface PlayerPageStatsProps {
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
    };
}

export interface PlayerStat {
    statValue: String
    statTitle: String
}


export default function PlayerPageStats(props: PlayerPageStatsProps) {

    // TODO get this from props or on tab load
    let allPlayerStats: PlayerStat[] = [
        {statTitle: "GPM", statValue: "200"},
        {statTitle: "CSPM", statValue: "300"},
        {statTitle: "Gold Per Game", statValue: "1000"},
        {statTitle: "GPM", statValue: "1000"},
        {statTitle: "Vision Score", statValue: "1234"},
        {statTitle: "KP", statValue: "12345"},
        {statTitle: "XPD @15", statValue: "12345"},
        {statTitle: "XPD @25", statValue: "2"},
    ]

    return (
        <Box>
            <FilterBar seasonConfig={props.seasonConfig}/>
            <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 3}}>
                <Box sx={{minWidth: 290}}>
                    <RisenBox1>
                        RADAR HERE
                    </RisenBox1>
                </Box>
                <Box>
                    <PerformanceOverview allPlayerStats={allPlayerStats}/>
                </Box>
            </Box>
        </Box>

    );
}