import React from "react";
import {Box, Typography} from "@mui/material";
import StatBox from "./stats/stat-box";
import RisenBox1 from "../risen-box/risen-box-1";

interface PlayerPageStatsProps {
}

export interface PlayerStat {
    statValue: String
    statTitle: String
}


export default function PlayerPageStats(playerStats: PlayerPageStatsProps) {

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
        <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 3}}>
            <Box sx={{minWidth: 290}}>
                <RisenBox1>
                    RADAR HERE
                </RisenBox1>
            </Box>
            <Box sx={{display: "flex", columnGap: 3}}>
                {allPlayerStats.map((playerStat) => <StatBox statTitle={playerStat.statTitle} statValue={playerStat.statValue}/>)}
            </Box>
        </Box>
    );
}