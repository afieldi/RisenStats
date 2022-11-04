import {Box, Grid, Theme, Typography} from "@mui/material";
import StatBox from "./stat-box";
import React from "react";
import {PlayerStat} from "../stats";
import {useTheme} from "@emotion/react";

export interface PerformanceOverviewProps {
    allPlayerStats: PlayerStat[]
}

export default function PerformanceOverview(performanceOverviewProps: PerformanceOverviewProps) {
    const theme = useTheme() as Theme;

    return(
        <Grid item xs={1} md={1}>
            <Typography color={theme.palette.info.light} align="left" variant="h4">Performance Overview</Typography>
            <Box sx={{display: "flex", columnGap: 1, rowGap: 2, flexWrap: "wrap"}}>
                { performanceOverviewProps.allPlayerStats.map((playerStat) =>
                    <StatBox statTitle={playerStat.statTitle} statValue={playerStat.statValue}/>)
                }
            </Box>
        </Grid>
    );
}