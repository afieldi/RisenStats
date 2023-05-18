import { Box, Grid, Theme, Typography } from '@mui/material';
import StatBox from './stat-box';
import React from 'react';
import { useTheme } from '@emotion/react';
import { BaseStatGenerator } from '../../../common/stats-generators/BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { StatGenerators } from '../../../common/constants';

export interface PerformanceOverviewProps {
    playerStats: PlayerStatModel[]
    leaderboardStats: PlayerStatModel[]
    playerPuuid?: string
}

const statsGenerators: BaseStatGenerator[] = [
    StatGenerators.KDA,
    StatGenerators.DMG_PERCENT,
    StatGenerators.CSPM,
    StatGenerators.DPM,
    StatGenerators.GOLD_SHARE,
    StatGenerators.KP_PERCENT,
    StatGenerators.AVERAGE_VS,
    StatGenerators.AVERAGE_VSPM,
    StatGenerators.VS_PERCENT,
    StatGenerators.DEATH_PERCENT,
    StatGenerators.DMG_PER_GOLD,
    StatGenerators.GPM,
    StatGenerators.SOLO_KILL,
    StatGenerators.DMG_TAKEN_PM,
    StatGenerators.XP_DIFF_15,
    StatGenerators.XP_DIFF_25,
    StatGenerators.GOLD_DIFF_15,
    StatGenerators.GOLD_DIFF_25,
    StatGenerators.CS_DIFF_15,
    StatGenerators.CS_DIFF_25,
];

export default function PerformanceOverview(performanceOverviewProps: PerformanceOverviewProps) {
    const theme = useTheme() as Theme;
    return(
        <Grid item xs={1} md={1}>
            <Typography fontFamily="Montserrat" color={theme.palette.info.light} align="left" variant="h4">PERFORMANCE OVERVIEW</Typography>
            <Box sx={{ display: 'flex', columnGap: 1, rowGap: 2, flexWrap: 'wrap' }}>
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
        if(sorted[rank].playerPuuid === performanceOverviewProps.playerPuuid) {
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

