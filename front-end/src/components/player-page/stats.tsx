import React from "react";
import {
    Box,
} from "@mui/material";
import RisenBox1 from "../risen-box/risen-box-1";
import PerformanceOverview from "./stats/performance-overview";
import SeasonModel from "../../../../Common/models/season.model";
import FilterBar from "./stats/filter-bar";
import ChampionOverview from "./stats/champion-overview";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";

interface PlayerPageStatsProps {
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
    };
    championData: PlayerChampionStatsModel[]
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
                <Box sx={{rowGap: 10}}>
                    <PerformanceOverview allPlayerStats={allPlayerStats}/>
                    <ChampionOverview championData={props.championData}/>
                </Box>
            </Box>
        </Box>

    );
}