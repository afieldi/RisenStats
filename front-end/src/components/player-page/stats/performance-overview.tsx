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
import {KPAStatGenerator} from "./stats-generators/KPAStatGenerator";
import {AverageVisionScoreStatGenerator} from "./stats-generators/AverageVisionScoreStatGenerator";
import {DeathPercentStatGenerator} from "./stats-generators/DeathPercentStatGenerator";
import {DPGStatGenerator} from "./stats-generators/DPGStatGenerator";
import {VisionScorePercentStatGenerator} from "./stats-generators/VisionScorePercentStatGenerator";
import {GPMStatGenerator} from "./stats-generators/GPMStatGenerator";
import {DiffEnum, DiffStatGenerator} from "./stats-generators/DiffStatGenerator";
import {DamageTakenPerMinuteStatGenerator} from "./stats-generators/DamageTakenPerMinuteStatGenerator";
import {SoloKillStatGenerator} from "./stats-generators/SoloKillStatGenerator";

export interface PerformanceOverviewProps {
    playerStats: PlayerStatModel[]
}

const statsGenerators: BaseStatGenerator[] = [
    new KDAStatGenerator(),
    new DMGPercentStatGenerator(),
    new CSPMStatGenerator(),
    new DPMStatGenerator(),
    new GoldShareStatGenerator(),
    new KPAStatGenerator(),
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