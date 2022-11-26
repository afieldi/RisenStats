import {Box, Grid, Theme, Typography} from "@mui/material";
import StatBox from "./stat-box";
import React from "react";
import {useTheme} from "@emotion/react";
import {BaseStatGenerator} from "./stats-generators/BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {KDAStatGenerator} from "./stats-generators/KDAStatGenerator";
import {DMGPercentStatGenerator} from "./stats-generators/DMGPercentStatGenerator";
import {CSPMStatGenerator} from "./stats-generators/CSPMStatGenerator";
import {DPMStatGenerator} from "./stats-generators/DPMStatGenerator";
import {GoldShareStatGenerator} from "./stats-generators/GoldShareStatGenerator";
import {AverageVisionScoreStatGenerator} from "./stats-generators/AverageVisionScoreStatGenerator";
import {DeathPercentStatGenerator} from "./stats-generators/DeathPercentStatGenerator";
import {DPGStatGenerator} from "./stats-generators/DPGStatGenerator";
import {VisionScorePercentStatGenerator} from "./stats-generators/VisionScorePercentStatGenerator";
import {GPMStatGenerator} from "./stats-generators/GPMStatGenerator";
import {DiffEnum, DiffStatGenerator} from "./stats-generators/DiffStatGenerator";
import {DamageTakenPerMinuteStatGenerator} from "./stats-generators/DamageTakenPerMinuteStatGenerator";
import {SoloKillStatGenerator} from "./stats-generators/SoloKillStatGenerator";
import {KPPercentStatGenerator} from "./stats-generators/KPPercentStatGenerator";

export interface PerformanceOverviewProps {
    playerStats: PlayerStatModel[]
    leaderboardStats: PlayerStatModel[]
    playerPuuid?: string
}

const statsGenerators: BaseStatGenerator[] = [
    new KDAStatGenerator(),
    new DMGPercentStatGenerator(),
    new CSPMStatGenerator(),
    new DPMStatGenerator(),
    new GoldShareStatGenerator(),
    new KPPercentStatGenerator(),
    new AverageVisionScoreStatGenerator(),
    new DeathPercentStatGenerator(),
    new DPGStatGenerator(),
    new VisionScorePercentStatGenerator(),
    new GPMStatGenerator(),
    new SoloKillStatGenerator(),
    new DamageTakenPerMinuteStatGenerator(),
    new DiffStatGenerator(DiffEnum.XP, 15),
    new DiffStatGenerator(DiffEnum.XP,25),
    new DiffStatGenerator(DiffEnum.GOLD, 15),
    new DiffStatGenerator(DiffEnum.GOLD,25),
    new DiffStatGenerator(DiffEnum.CS, 15),
    new DiffStatGenerator(DiffEnum.CS,25)
]

export default function PerformanceOverview(performanceOverviewProps: PerformanceOverviewProps) {
    const theme = useTheme() as Theme;
    return(
        <Grid item xs={1} md={1}>
            <Typography color={theme.palette.info.light} align="left" variant="h4">Performance Overview</Typography>
            <Box sx={{display: "flex", columnGap: 1, rowGap: 2, flexWrap: "wrap"}}>
                { statsGenerators.map((statGenerator, index) =>
                        getStatBox(index, statGenerator, performanceOverviewProps)
                )}
            </Box>
        </Grid>
    );
}

function getStatBox(index: number, statGenerator: BaseStatGenerator, performanceOverviewProps: PerformanceOverviewProps) {
    let sorted: PlayerStatModel[] = statGenerator.getSortedLeaderboard(performanceOverviewProps.leaderboardStats);

    const average = sorted.reduce((total, next) => total + statGenerator.getStatValue(next), 0) / sorted.length;

    let rank = 0;
    let isPlayerInLeaderBoard = false;
    for(; rank < sorted.length; rank++) {
        if(sorted[rank].playerPuuid == performanceOverviewProps.playerPuuid) {
            isPlayerInLeaderBoard = true;
            break;
        }
    }

    return <StatBox key={index}
                    statToolTip={statGenerator.getToolTip()}
                    statValue={statGenerator.getStatString(performanceOverviewProps.playerStats)}
                    statTitle={statGenerator.getStatTitle()}
                    haveStatsLoaded={statGenerator.canLoadData(performanceOverviewProps.playerStats)}
                    shouldShowLeaderboard={isPlayerInLeaderBoard && statGenerator.canLoadData(performanceOverviewProps.playerStats)}
                    leaderboardData={{
                        rank: rank + 1,
                        leagueAvg: average,
                        totalPLayersOnLeaderboard: sorted.length
                    }}
    />;
}

