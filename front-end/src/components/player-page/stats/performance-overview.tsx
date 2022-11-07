import {Box, Grid, Theme, Typography} from "@mui/material";
import StatBox from "./stat-box";
import React from "react";
import {useTheme} from "@emotion/react";
import {BaseStatGenerator} from "./stats-generators/BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export interface PerformanceOverviewProps {
    statsGenerators: BaseStatGenerator[]
    playerStats: PlayerStatModel[]
}

export default function PerformanceOverview(performanceOverviewProps: PerformanceOverviewProps) {
    const theme = useTheme() as Theme;

    return(
        <Grid item xs={1} md={1}>
            <Typography color={theme.palette.info.light} align="left" variant="h4">Performance Overview</Typography>
            <Box sx={{display: "flex", columnGap: 1, rowGap: 2, flexWrap: "wrap"}}>
                { performanceOverviewProps.statsGenerators.map((statGenerator, index) =>
                        <StatBox key={index}
                                 statToolTip={statGenerator.getToolTip()}
                                 statValue={statGenerator.getStatValue(performanceOverviewProps.playerStats)}
                                 statTitle={statGenerator.getStatTitle()}
                                 haveStatsLoaded={statGenerator.canLoadData(performanceOverviewProps.playerStats)}
                        />
                )}
            </Box>
        </Grid>
    );
}